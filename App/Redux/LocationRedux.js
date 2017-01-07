// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  locationRequest: ['id'],
  locationUpdate: ['location'],
  locationSuccess: ['location'],
  locationFailure: null
})

export const LocationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  location: null,
  fetching: null,
  error: null,
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const request = (state: Object, { location }: Object) =>
  state.merge({ fetching: true, location: null })

// request the temperature for a city
export const update = (state: Object, { location }: Object) =>
  state.merge({ fetching: true, location: null })

// successful temperature lookup
export const success = (state: Object, action: Object) => {
  const { location } = action
  return state.merge({ fetching: false, error: null, location })
}

// failed to get the temperature
export const failure = (state: Object) =>
  state.merge({ fetching: false, error: true, location: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOCATION_REQUEST]: request,
  [Types.LOCATION_UPDATE]: update,
  [Types.LOCATION_SUCCESS]: success,
  [Types.LOCATION_FAILURE]: failure
})
