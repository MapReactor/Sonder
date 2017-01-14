import { call, put, take, fork, } from 'redux-saga/effects'
import FriendsLocationsActions from '../Redux/FriendsLocationsRedux'
import { eventChannel } from 'redux-saga'

console.log('opening friends locations saga')

function websocketInitChannel() {
  return eventChannel( emitter => {
    console.log('attempting to open ws')
    // init the connection here
    const ws = new WebSocket('ws://sonder.herokuapp.com')

    ws.onopen = () => {
      console.log('opening ws')
      ws.send('hello')
    }

    ws.onerror = (error) => {
      console.log('WebSocket error ' + error)
    }

    ws.onmessage = (e) => {
      // transform data
      let payload = {};
      payload.id = e.id
      payload.longitude = e.longitude
      payload.latitude = e.latitude
      payload.type = 'publish'

      // dispatch an action with emitter here
      return emitter( { type: 'FRIENDS_LOCATIONS_UPDATE', friendLocation: payload } )
    }
    // unsubscribe function
    return () => {
      // do whatever to interrupt the socket communication here
      console.log('closing ws')
    }
  })
}
 const websocketSaga = function * () {
  const channel = yield call(websocketInitChannel)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

module.exports = { websocketSaga };
