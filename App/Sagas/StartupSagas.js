import { put, select } from 'redux-saga/effects'
import LocationActions from '../Redux/LocationRedux'
import { is } from 'ramda'

// process STARTUP actions
export function * startup (action) {
  if (__DEV__ && console.tron) {
  //yield put(LocationActions.locationRequest('ElmerFudd'))
  //yield put(LocationActions.locationUpdate({id: 'ElmerFudd', latitude: 777, longitude: 666, bearing: 555}))
  }
}
