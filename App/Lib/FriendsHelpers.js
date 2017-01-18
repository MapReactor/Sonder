
export default {

  updateFriendsLocations: (prevState, nextProps) => {
    let arr = []
    let prevAnnotations = prevState.annotations.slice()

    for (let newPoint in nextProps.friendsLocations) {

      let friendLocation = nextProps.friendsLocations
      if ( friendLocation[newPoint].longitude && ( typeof Number( friendLocation[newPoint].longitude ) === 'number' ) ) {

        // remove old annotation
        prevAnnotations.forEach((annotation, i) => {
          if ( annotation.id === newPoint ) {
            prevAnnotations.splice(i, 1)
          }
        })

        // add new annotation
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
    arr.unshift( ...prevAnnotations )
    return { annotations: arr }
  },

}
