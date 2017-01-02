import React from 'react'
import { connect } from 'react-redux'
import { 
  AppRegistry,
  View, 
  Text,
  DeviceEventEmitter
} from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import MapView from 'react-native-maps'
import { calculateRegion } from '../Lib/MapHelpers'
import MapCallout from '../Components/MapCallout'
import Styles from './Styles/MapviewExampleStyle'

// Neighborhood data is loaded from a fixture, to anticipate Ignite's API/fixtures conventions
// Note: ignoring redux-saga structure for now, so this eventually shouldn't go in here!
import FixtureApi from '../Services/FixtureApi'

/* ***********************************************************
* IMPORTANT!!! Before you get started, if you are going to support Android,
* PLEASE generate your own API key and add it to android/app/src/main/AndroidManifest.xml
* We've included our API key for demonstration purposes only, and it will be regenerated from
* time to time. As such, neglecting to complete this step could potentially break your app in production!
* https://console.developers.google.com/apis/credentials
* Also, you'll need to enable Google Maps Android API for your project:
* https://console.developers.google.com/apis/api/maps_android_backend/
*************************************************************/

class MapviewExample extends React.Component {
  /* ***********************************************************
  * This example is only intended to get you started with the basics.
  * There are TONS of options available from traffic to buildings to indoors to compass and more!
  * For full documentation, see https://github.com/lelandrichardson/react-native-maps
  *************************************************************/

  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * Set the array of locations to be displayed on your map. You'll need to define at least
    * a latitude and longitude as well as any additional information you wish to display.
    *************************************************************/
    const locations = [
      { title: 'Location A', latitude: 37.78825, longitude: -122.4324 },
      { title: 'Location B', latitude: 37.75825, longitude: -122.4624 }
    ]
    /* ***********************************************************
    * STEP 2
    * Set your initial region either by dynamically calculating from a list of locations (as below)
    * or as a fixed point, eg: { latitude: 123, longitude: 123, latitudeDelta: 0.1, longitudeDelta: 0.1}
    *************************************************************/
    const region = calculateRegion(locations, { latPadding: 0.05, longPadding: 0.05 })

    this.state = {
      region,
      locations,
      showUserLocation: true,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      compassLine: null,
      neighborhoods: FixtureApi.getNeighborhoodBoundaries('San Francisco').data
    }
    this.renderMapMarkers = this.renderMapMarkers.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    this.watchID = null
    this.locations = locations
  }

  mapNeighborhoods() {
    const coords = this.state.neighborhoods.features[12].geometry.coordinates[2][0].map(coords => {
      return { 
        longitude: coords[0],
        latitude: coords[1]
      }
    });
    return (
      <MapView.Polygon
        key="12312"
        coordinates={coords}
        strokeColor="#F00"
        fillColor="rgba(0,0,255,0.5)"
        strokeWidth={1}
      />
    );
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
        // alert(typeof this.map.fitToSuppliedMarkers);
        // alert(JSON.stringify(this.state.region));
        this.setState({initialPosition: position});
      },
      (error) => alert(JSON.stringify(error))
      );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        lastPosition: position
      });
    });

    ReactNativeHeading.start(1)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      });
    });
    // var lame = 0;

    DeviceEventEmitter.addListener('headingUpdated', data => {
      console.log('New heading is: ', data.heading);
      const curPos = this.state.lastPosition || this.state.initialPosition;
      if (curPos !== 'unknown') {
        const curCoords = curPos.coords;
        this.setState({
          compassLine: getCompassLine(data.heading, 10, curCoords),
          heading: data.heading
        });
      } else {
        this.setState({
          heading: data.heading
        });
      }
    });
  }

  componentWillUnmount() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillReceiveProps (newProps) {
    /* ***********************************************************
    * STEP 3
    * If you wish to recenter the map on new locations any time the
    * Redux props change, do something like this:
    *************************************************************/
    // this.setState({
    //   region: calculateRegion(newProps.locations, { latPadding: 0.1, longPadding: 0.1 })
    // })
  }

  onRegionChange (newRegion) {
    /* ***********************************************************
    * STEP 4
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
    /* ***********************************************************
    * STEP 6
    * Customize the appearance and location of the map marker.
    * Customize the callout in ../Components/MapCallout.js
    *************************************************************/

    return (
      <MapView.Marker key={location.title} coordinate={{latitude: location.latitude, longitude: location.longitude}}>
        <MapCallout location={location} onPress={this.calloutPress} />
      </MapView.Marker>
    )
  }

  render () {
    return (
      <View style={Styles.container}>
        <MapView
          ref = { ref => { this.map = ref; }}
          style={Styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          showsUserLocation={this.state.showUserLocation}
        >
          {this.state.locations.map((location) => this.renderMapMarkers(location))}
          { this.state.compassLine ? 
            <MapView.Polyline
              key="editingPolyline"
              coordinates={this.state.compassLine}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            /> : 
            null }
            {/*this.mapNeighborhoods()*/}
        </MapView>
        <View style={Styles.buttonContainer}>
          <View style={Styles.bubble}>
            <Text>{this.state.headingIsSupported ? 
                    getPrettyBearing(this.state.heading)
                    : "Heading unsupported." }</Text>
          </View>
        </View>
        <View style={Styles.buttonContainer}>
          <View style={Styles.bubble}>
            <Text>{JSON.stringify(this.state.debug)}</Text>
          </View>
        </View>
      </View>
    )
  }
}

// BEGIN: function dump
// Put these elsewhere, such as in CompassHelpers.js

const toRadians = (heading) => heading * (Math.PI / 180);
const getCompassLine = (heading, radius, origin) => [origin, { 
  longitude: origin.longitude + radius * Math.sin(toRadians(heading)),
  latitude: origin.latitude + radius * Math.cos(toRadians(heading))
}];

const getPrettyBearing = (heading) => {
  const degreeChar = String.fromCharCode(176);
  const primaryCardinality = (heading >= 270 || heading <= 90) ? 'N' : 'S';
  const secondaryCardinality = (heading <= 180) ? 'E' : 'W';
  const angle = (heading <= 90) ? heading : 
                   (heading <= 180) ? 180 - heading :
                     (heading <= 270) ? heading - 180 : 360 - heading;
 return primaryCardinality + angle + degreeChar + secondaryCardinality;
};

const renderBoundaries = (geojson) => {

}

// END: function dump

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

export default connect(mapStateToProps)(MapviewExample)
