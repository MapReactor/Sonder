
export default {

  updateFriendsLocations: (nextProps, prevState) => {
    console.log('in updateFriendsLocations')
    var arr = [ ...prevState.annotations ]
    for (let newPoint in nextProps.friendsLocations) {
      let friendLocation = nextProps.friendsLocations
      if (friendLocation[newPoint].longitude) {
        arr.push ({
            coordinates: [ Number( friendLocation[newPoint].longitude ), Number( friendLocation[newPoint].latitude) ],
            type: 'point',
            title: newPoint,
            id: newPoint,
        })
      }
    }
    console.log('arr', arr)
    return { annotations: arr }
  }

}
