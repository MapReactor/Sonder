// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  friendsLocationsRequest: ['id'],
  friendsLocationsSuccess: ['friendsLocations'],
  friendsLocationsFailure: null,
})

export const FriendsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  friendsLocations: null,  // latitude, longitude, bearing, picture
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

// we're attempting to get friends' locations
export const request = (state: Object) => state.merge({ fetching: true })

// we've successfully got friends' locations
export const success = (state: Object, { friendsLocations }: Object) =>
  state.merge({ fetching: false, error: null, friendsLocations })

// we've had a problem getting friends' locations
export const failure = (state: Object, { error }: Object) =>
  state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FRIENDS_LOCATIONS_REQUEST]: request,
  [Types.FRIENDS_LOCATIONS_SUCCESS]: success,
  [Types.FRIENDS_LOCATIONS_FAILURE]: failure,
})
