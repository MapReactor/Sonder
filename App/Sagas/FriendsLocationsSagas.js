import { call, put, take, fork, } from 'redux-saga/effects'
import FriendsLocationsActions from '../Redux/FriendsLocationsRedux'
import { eventChannel } from 'redux-saga'

let open = false
let channel


function websocketInitChannel() {
  return eventChannel( emitter => {
    // init the connection
    const ws = new WebSocket('ws://localhost:3000')

    ws.onopen = () => {
      open = true
      console.log('opening ws')
      ws.send(JSON.stringify({"type": "subscribe", "friends": ["123"]}))
      // ws.send("msg1")
      // ws.send("msg2")
      // ws.send("msg3")
    }

    ws.onerror = (error) => {
      console.log('ws error: ', error)
      console.dir(error)
      ws.close()
    }

    ws.onmessage = (e) => {
      console.log('ws message: ', e.data);
      // transform data
      let payload = {}
      payload.id = e.id
      payload.longitude = e.longitude
      payload.latitude = e.latitude
      payload.type = 'publish'

      // dispatch an action with emitter
      console.log(payload)
      return emitter( { type: 'FRIENDS_LOCATIONS_UPDATE', friendLocation: payload } )
      ws.close()
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
