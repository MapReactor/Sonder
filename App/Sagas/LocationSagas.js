import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import LocationActions from '../Redux/LocationRedux'
import LocationService from '../Services/LocationService'
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
  const currentLocation = yield call(LocationService.getCurrentDeviceLocation);
  if (currentLocation.position.coords) {
    //console.tron.log('currentLocation.position:'+JSON.stringify(currentLocation.position));
    location.latitude = currentLocation.position.coords.latitude;
    location.longitude = currentLocation.position.coords.longitude;
    location.bearing = currentLocation.position.coords.heading;
  }

  console.tron.log('location:'+JSON.stringify(location));

  const response = yield call(api.updateLocation, location)
  // success?
  if (response.ok) {
    //const kelvin = path(['data', 'main', 'temp_max'], response)
    //const temperature = convertFromKelvin(kelvin)
    yield put(LocationActions.locationSuccess(response.data.id, 'bonus'))
  } else {
    yield put(LocationActions.locationFailure())
  }
}

module.exports = { getLocation, updateLocation };
