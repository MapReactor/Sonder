// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  friendsLocationsUpdate: ['friendsLocations'],
  // friendsLocationsSuccess: ['friendsLocations'],
  // friendsLocationsFailure: null,
})

export const FriendsLocationsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  friendsLocations: {
    '123': { 'longitude': '1', 'latitude': '1', },
    '456': { 'longitude': '1', 'latitude': '2' }
  },  // latitude, longitude, bearing, picture
  // error: null,
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
    console.log('newLocation: ', newLocation)

    return Object.assign({}, state, Object.assign({}, state.friendsLocations, newLocation))
  }
  return state
}

// we've successfully got friends' locations
// export const success = (state: Object, { friendLocation }: Object) => {
  // update particular friend location
  // console.log(friendsLocations);
// }

// we've had a problem getting friends' locations
// export const failure = (state: Object, { error }: Object) => {
//   state.merge({ error })
// }

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FRIENDS_LOCATIONS_UPDATE]: update,
  // [Types.FRIENDS_LOCATIONS_SUCCESS]: success,
  // [Types.FRIENDS_LOCATIONS_FAILURE]: failure,
})
