import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
import LocationAPI from '../Services/LocationApi'
import FixtureAPI from '../Services/FixtureApi'
import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { LocationTypes } from '../Redux/LocationRedux'
import { TemperatureTypes } from '../Redux/TemperatureRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login } from './LoginSagas'
import { getLocation, updateLocation } from './LocationSagas'
import { getTemperature } from './TemperatureSagas'
import { openScreen } from './OpenScreenSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugSettings.useFixtures ? FixtureAPI : API.create()
const locationApi = DebugSettings.useFixtures ? FixtureAPI : LocationAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(LoginTypes.LOGIN_REQUEST, login),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),
    takeLatest(LocationTypes.LOCATION_REQUEST, getLocation, locationApi),
    takeLatest(LocationTypes.LOCATION_UPDATE, updateLocation, locationApi),
    // some sagas receive extra parameters in addition to an action
    takeLatest(TemperatureTypes.TEMPERATURE_REQUEST, getTemperature, api)
  ]
}
