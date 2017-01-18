
export default {

  // todo: optomize by removing old annotation before adding new one
  updateFriendsLocations: (prevState, nextProps) => {
    console.log('in updateFriendsLocations')
    var arr = [ ...prevState.annotations ]
    for (let newPoint in nextProps.friendsLocations) {
      let friendLocation = nextProps.friendsLocations
      if (friendLocation[newPoint].longitude) {
        console.log('THIS IS NAME', friendLocation[newPoint].name)

        if ( typeof Number( friendLocation[newPoint].longitude ) === 'number' ) {
          arr.push ({
              coordinates: [ Number( friendLocation[newPoint].longitude ), Number( friendLocation[newPoint].latitude) ],
              type: 'point',
              title: friendLocation[newPoint].name,
              id: newPoint,
          })
        }

      }
    }
    console.log('arr', arr)
    return { annotations: arr }
  },

}
