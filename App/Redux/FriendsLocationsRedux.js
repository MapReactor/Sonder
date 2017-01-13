// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  friendsLocationRequest: ['id'],
  friendsLocationSuccess: ['friendsLocations'],
  friendsLocationFailure: null,
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
  [Types.FRIENDS_LOCATION_REQUEST]: request,
  [Types.FRIENDS_LOCATION_SUCCESS]: success,
  [Types.FRIENDS_LOCATION_FAILURE]: failure,
})
