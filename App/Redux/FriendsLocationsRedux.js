// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  friendsLocationsSuccess: ['friendsLocations'],
  friendsLocationsFailure: null,
})

export const FriendsLocationsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  friendsLocations: {},  // latitude, longitude, bearing, picture
  error: null,
})

/* ------------- Reducers ------------- */

// we've successfully got friends' locations
export const success = (state: Object, { friendsLocations }: Object) =>
  // update particular friend location
  state.merge({ friendsLocations })

// we've had a problem getting friends' locations
export const failure = (state: Object, { error }: Object) =>
  state.merge({ error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FRIENDS_LOCATIONS_SUCCESS]: success,
  [Types.FRIENDS_LOCATIONS_FAILURE]: failure,
})
