import { call, put, take, fork, } from 'redux-saga/effects'
import FriendsLocationsActions from '../Redux/FriendsLocationsRedux'
import { eventChannel } from 'redux-saga'
import UsersApi from '../Services/UsersApi'

let open = false
let channel
let friends

function websocketInitChannel() {
  return eventChannel( emitter => {
    // init the connection
    const ws = new WebSocket('ws://localhost:3000')

    ws.onopen = () => {
      open = true
      console.log('opening ws')

      // fetch friends
      UsersApi.getFriends(function(res, userInfo) {
        console.log('fetched friends from saga', res, userInfo)

        // subscribe to friends locations
        ws.send(JSON.stringify({
          "type": "subscribe",
          "friends": res.data.following.map((friend) => {
            return friend.fb_id.toString()
          }),
        }))
      })

    }

    ws.onerror = (error) => {
      console.log('ws error: ', error)
      ws.close()
    }

    ws.onmessage = (e) => {
      console.log('ws message: ', e.data);
      let res = JSON.parse(e.data)
      if (res.type === 'location') {
        // transform data
        let payload = {}
        payload.id = res.message.id
        payload.longitude = res.message.longitude
        payload.latitude = res.message.latitude

        // dispatch an action with emitter
        console.log(payload)
        return emitter( { type: 'FRIENDS_LOCATIONS_UPDATE', friendsLocations: payload } )
        ws.close()
      }
    }

    ws.onclose = (e) => {
      open = false
      console.log('closing ws')
    }

    // unsubscribe function
    return () => {
      // interrupt the socket communication
      console.log('closing ws')
      ws.close()
    }
  })
}

// watcher saga
 const websocketSaga = function * () {
   if (!open) {
     channel = yield call(websocketInitChannel)
  }
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

module.exports = { websocketSaga };
