import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import LocationActions from '../Redux/LocationRedux'
import convertFromKelvin from '../Transforms/ConvertFromKelvin'

const getLocation = function * (api, action) {
  const { id } = action
  // make the call to the api
  const response = yield call(api.getLocation, id)

  // success?
  if (response.ok) {
    yield put(LocationActions.locationSuccess(response.data, 'bonus'))
  } else {
    yield put(LocationActions.locationFailure())
  }
}

const updateLocation = function * (api, action) {
  const { location } = action
  const response = yield call(api.updateLocation, location)
  // success?
  if (response.ok) {
    //const kelvin = path(['data', 'main', 'temp_max'], response)
    //const temperature = convertFromKelvin(kelvin)
    yield put(LocationActions.locationSuccess(response.data, 'bonus'))
  } else {
    yield put(LocationActions.locationFailure())
  }
}

module.exports = { getLocation, updateLocation };
