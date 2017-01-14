import { call, put, take, fork, } from 'redux-saga/effects'
import FriendsLocationsActions from '../Redux/FriendsLocationsRedux'


function websocketInitChannel() {
  return eventChannel( emitter => {
    // init the connection here
    const ws = new WebSocket() // todo, enter ws url

    ws.onopen = () => {
      console.log('opening ws')
      ws.send('hello')
    }

    ws.onerror = (error) => {
      console.log('WebSocket error ' + error)
    }

    ws.onmessage = e => {
      // transform data

      // dispatch an action with emitter here
      return emitter( { type: 'ACTION_TYPE', payload } )
    }
    // unsubscribe function
    return () => {
      // do whatever to interrupt the socket communication here
      console.log('closing ws')
    }
  })
}
export default function* websocketSagas() {
  const channel = yield call(websocketInitChannel)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}
