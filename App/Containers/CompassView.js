import React from 'react'
import { connect } from 'react-redux'
import { 
  AppRegistry,
  View, 
  Text
} from 'react-native'
import { calculateRegion } from '../Lib/MapHelpers'
import MapView from 'react-native-maps'
import MapCallout from '../Components/MapCallout'
import Styles from './Styles/MapViewStyle'
import Compass from '../Lib/Compass'

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
  // Note: this only renders when the compass line exists
  // lastPosition also exists
  constructor (props) {
    super(props);
  }

  componentWillMount() {
    // Sends these back to the top for collisions
    // this.props.setAdjacents(this.adjacentHoods);
    // this.props.setCurrentHood(this.currentHood); 

    // Keeps things over here for rendering
    // this.hoods = this.mapifyHoods(this.filteredFeatures);
    // this.streets = this.mapifyStreets(this.props.streets);
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.lastPosition !== nextProps.lastPosition);
  }
  render() {
    const hoods = this.props.hoods;
    const streets = this.props.streets;
    // alert(JSON.stringify(hoods));
    return (
      <View>
        {streets.map((streetLine, index) => (
          <MapView.Polyline
            key={index}
            coordinates={streetLine.coords}
            strokeColor="rgb(255,215,0)"
            strokeWidth={2}
          />
        ))}
        {hoods.map((hoodPoly, index) => (
          <MapView.Polygon
            key={index}
            coordinates={hoodPoly.coords}
            strokeColor="rgb(0,0,0)"
            fillColor={binduRGB(hoodPoly.name,0.5)}
            strokeWidth={1}
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
      adjacentHoods: null,
      currentHood: null,
      hoods: null,
      streets: null,
      entities: null
    }
    this.renderMapMarkers = this.renderMapMarkers.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    this.watchID = null
    this.locations = locations
  }
  componentWillMount() {
    Compass.start({
      minAngle: 1,
      radius: 10,
      onInitialPosition: (initialPosition) => {
        this.setState({ initialPosition })
      },
      onInitialHoods: ({ currentHood, adjacentHoods, hoodLatLngs, streetLatLngs}) => {
        this.setState({ 
          currentHood, 
          adjacentHoods, 
          hoods: hoodLatLngs,
          streets: streetLatLngs
        });
      },
      onHeadingSupported: (headingIsSupported) => 
        this.setState({ headingIsSupported }),
      onPositionChange: (lastPosition) => 
        this.setState({ lastPosition }),
      onHeadingChange: (headingData) => 
        this.setState(headingData),
      onEntitiesDetected: (entities) => 
        this.setState({ entities })
    });
  }

  componentWillUnmount() {
    Compass.stop();
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
    // alert(JSON.stringify( getRegionBBox(newRegion) ));
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
    this.setState({ region: newRegion });
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
    // const compassLineFeature = this.state.compassLine ? lineString(toTuples(this.state.compassLine)) : null;
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
          { this.state.hoods ? 
            <Neighborhoods 
              compassLine={this.state.compassLine}
              lastPosition={this.state.lastPosition}
              hoods={this.state.hoods} 
              streets={this.state.streets}
            /> :
            null }

          {/* this.state.region ? 
            <MapView.Polygon
              key="QWEWQEQW"
              coordinates={toCoords(getRegionBBox(this.state.region))}
              strokeColor="#F00"
              fillColor={binduRGB("WAKA!",0.5)}
              strokeWidth={1}
            /> : 
            null */}

            {/*this.mapNeighborhoods()*/}
        </MapView>
        <View style={Styles.buttonContainer}>
          <View style={Styles.bubble}>
            <Text>{this.state.entities ? 
              JSON.stringify(this.state.entities.hoods) : 
              "Waiting for entities..."}</Text>
          </View>
        </View>
        <View style={Styles.buttonContainer}>
          <View style={Styles.bubble}>
            <Text>{this.state.headingIsSupported ?
                    getPrettyBearing(this.state.heading)
                    : "Heading unsupported." }</Text>
          </View>
        </View>
        <View style={Styles.buttonContainer}>
          <View style={Styles.bubble}>
            <Text>{this.state.entities ? 
                    JSON.stringify(this.state.entities.streets) :
                    "Normalizing reticulating splines..."}</Text>
          </View>
        </View>
      </View>
    )
  }
}

// BEGIN: function dump
// Put these elsewhere, such as in CompassHelpers.js

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
