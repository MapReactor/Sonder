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
import Styles from './Styles/MapViewStyle'

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
class Neighborhoods extends React.Component {
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    // slice to first MultiPolygon for debug purposes:
    const features = this.props.boundaries.features;
    const hoods = features.reduce((hoods, feature) => {
      // Check for polyline vs. non-polyline
      // If multiline, map each and add extra square braces
      const shapeType = feature.geometry.type;
      const hoodName = feature.properties.label;
      if (shapeType === 'Polygon') {
        const coordSet = feature.geometry.coordinates[0];
        const latLngs = coordSet.map((coords) => ({
          longitude: coords[0],
          latitude: coords[1]
        }));
        hoods.push({ name: hoodName, coords: latLngs});
      } else if (shapeType === 'MultiPolygon') {
        const multiCoordSet = feature.geometry.coordinates;
        multiCoordSet.forEach(coordSet => {
          // MultiPolygon adds an extra layer of depth, so get rid of it
          coordSet = coordSet[0];
          // alert(coordSet);
          const latLngs = coordSet.map((coords) => ({
            longitude: coords[0],
            latitude: coords[1]
          }));
          hoods.push({ name: hoodName, coords: latLngs});
        });
      }
      return hoods;
    },[]);
    // alert(JSON.stringify(hoods));
    return (
      <View>
        {hoods.map((hoodPoly, index) => (
          <MapView.Polygon
            key={index}
            coordinates={hoodPoly.coords}
            strokeColor="#F00"
            fillColor={binduRGB(hoodPoly.name,0.5)}
            strokeWidth={0}
          />
        ))}
      </View>
    );
  }
}

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

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
        // alert(typeof this.map.fitToSuppliedMarkers);
        // alert(JSON.stringify(this.state.region));
        this.setState({initialPosition: position});
      },
      (error) => null // alert(JSON.stringify(error))
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
          { this.state.compassLine ? 
            <Neighborhoods boundaries={this.state.neighborhoods} /> :
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

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const binduRGB = (text, alpha) => {
  // sums the ascii values of each character in the stat to use as seed
  let seed = text.split('').reduce( function(sum,item,i) { return sum + item.charCodeAt()*i+2 },0);
  const color = {
    r: parseInt(seededRandom(seed)*100+50),
    g: parseInt(seededRandom(++seed)*100+50),
    b: parseInt(seededRandom(++seed)*100+100)
  };
  return 'rgba('+color.r+','+color.g+','+color.b+','+alpha+')';
};

// END: function dump

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

export default connect(mapStateToProps)(MapviewExample)
