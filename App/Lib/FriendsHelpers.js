
export default {

  // todo: optomize by removing old annotation before adding new one
  updateFriendsLocations: (prevState, nextProps) => {
    console.log('in updateFriendsLocations')
    var arr = [ ...prevState.annotations ]
    for (let newPoint in nextProps.friendsLocations) {
      let friendLocation = nextProps.friendsLocations
      if ( friendLocation[newPoint].longitude && ( typeof Number( friendLocation[newPoint].longitude ) === 'number' ) ) {

        arr.push ({
          coordinates: [
            Number( friendLocation[newPoint].longitude ),
            Number( friendLocation[newPoint].latitude )
          ],
          type: 'point',
          title: friendLocation[newPoint].name,
          id: newPoint, // this is the friend's fbid
          annotationImage: {
            source: { uri: friendLocation[newPoint].picture },
            height: 25,
            width: 25
          },
        })

      }
    }
    return { annotations: arr }
  },

}
