// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  friendsLocationsUpdate: ['friendsLocations'],
})

export const FriendsLocationsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  friendsLocations: {
    '123': { 'longitude': '1', 'latitude': '1', },
    '456': { 'longitude': '1', 'latitude': '2' }
  },
})

/* ------------- Reducers ------------- */

export const update = (state: Object, action: Object) => {
  const { friendsLocations } = action
  if (friendsLocations) {
    let newLocation = {}
    newLocation[friendsLocations.id] = {
      'latitude': friendsLocations.latitude,
      'longitude': friendsLocations.longitude
    }
    return Object.assign({}, state, Object.assign({}, state.friendsLocations, newLocation))
  }
  return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FRIENDS_LOCATIONS_UPDATE]: update,
})
