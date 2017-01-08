import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import MapView from 'react-native-maps'
import { calculateRegion } from '../Lib/MapHelpers'
import MapCallout from '../Components/MapCallout'
import Styles from './Styles/MapViewStyle'
import UsersApi from '../Services/UsersApi'

class FriendsView extends React.Component {

  constructor (props) {
    super(props)

    // get fb id from local storage
    // const fbId = 'ENTER FBID';
    // let locations = [];
    // let locationsObj = {};

    // get friends info & locations
    // UsersApi.getFriends(fbId, function(friendsData) {
    //   console.log(friendsData);

    //   UsersApi.getLocations(fbId, function(friendsLocations) {
    //     console.log(friendsLocations);

        // for each friendData in frinedsData
          // locationsObj[friendData[fb_id]] = {
            // title: friendData[displayname]
            // image: require('./../Images/friendmarker.png')
            // latitude: null
            // longitude: null
          // };
        // 

        // for each friendLocation in friendsLocations
          // let id = friendLocation[fb_id];
          // locationsObj[id].latitude = friendLocation[lat]
          // locationsObj[id].longitude = friendLocation[lon]
        //

        // for each in locationsObj
          // push to locations
        //

    //   });
    // });

    // then... (needs to be in callback)


      // set markers location and data of each friend
      // const locations = [{ 
      //   title: 'friends name', /*add */
      //   image: require('./../Images/friendmarker.png'),
      //   latitude: 41.8781, 
      //   longitude: -87.6298,
      // }];

    // this is just test data
    const locations = [
      { title: 'Location A', /*image: require('./../Images/friendmarker.png'),*/ latitude: 37.78825, longitude: -122.4324 },
      { title: 'Location B', image: require('./../Images/friendmarker.png'), latitude: 37.75825, longitude: -122.4624 }
    ]

    // calculate what the map shows, update to draw map based on users location
    const region = calculateRegion(locations, { latPadding: 0.05, longPadding: 0.05 })
    this.state = {
      region,
      locations,
      showUserLocation: true,
    }

    // moving marker
    // setInterval(() => {
    //   this.setState({ 
    //     locations: [{
    //       title: this.state.locations[0].title,
    //       image: this.state.locations[0].image,
    //       latitude: this.state.locations[0].latitude + 0.0001,
    //       longitude: this.state.locations[0].longitude,
    //     }] 
    //   })
    // }, 1000);

    this.renderMapMarkers = this.renderMapMarkers.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)

  }

  componentWillReceiveProps (newProps) {
    /* ***********************************************************
    * If you wish to recenter the map on new locations any time the
    * Redux props change, do something like this:
    *************************************************************/
    // this.setState({
    //   region: calculateRegion(newProps.locations, { latPadding: 0.1, longPadding: 0.1 })
    // })
  }

  onRegionChange (newRegion) {
    /* ***********************************************************
    * If you wish to fetch new locations when the user changes the
    * currently visible region, do something like this:
    *************************************************************/
    // const searchRegion = {
    //   ne_lat: newRegion.latitude + newRegion.latitudeDelta,
    //   ne_long: newRegion.longitude + newRegion.longitudeDelta,
    //   sw_lat: newRegion.latitude - newRegion.latitudeDelta,
    //   sw_long: newRegion.longitude - newRegion.longitudeDelta
    // }
    // Fetch new data...
  }

  calloutPress (location) {
    /* ***********************************************************
    * STEP 5
    * Configure what will happen (if anything) when the user
    * presses your callout.
    *************************************************************/
    console.tron.log(location)
  }

  renderMapMarkers (location) {

    return (
      <MapView.Marker key={location.title} image={location.image} coordinate={{latitude: location.latitude, longitude: location.longitude}}>
        <MapCallout location={location} onPress={this.calloutPress} />
      </MapView.Marker>
    )
  }

  render () {
    return (
      <View style={Styles.container}>
        <MapView
          style={Styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          showsUserLocation={this.state.showUserLocation}
        >
          {this.state.locations.map((location) => this.renderMapMarkers(location))}
        </MapView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

export default connect(mapStateToProps)(FriendsView)
