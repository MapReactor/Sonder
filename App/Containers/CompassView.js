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
import { calculateRegion, getRegionBBox, toCoords, toTuples, toTuple } from '../Lib/MapHelpers'
import MapCallout from '../Components/MapCallout'
import Styles from './Styles/MapViewStyle'

// Neighborhood data is loaded from a fixture, to anticipate Ignite's API/fixtures conventions
// Note: ignoring redux-saga structure for now, so this eventually shouldn't go in here!
import FixtureApi from '../Services/FixtureApi'

import { lineString, point, polygon } from '@turf/helpers'
import intersect from '@turf/intersect'
import inside from '@turf/inside'
import Offset from 'polygon-offset'
import turf from '@turf/turf'

import { clone } from 'cloneextend'
import vis from 'code42day-vis-why'

const offset = new Offset()

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
    this.features = this.props.boundaries.features;
    // WARNING: this will *definitely* need to be done asynchronously!
    // this.filteredFeatures = this.features.filter(feature => feature.properties.label === 'Mission District');
    // alert(JSON.stringify(this.props.lastPosition))
    this.currentHood = this.features.filter(feature => {
      const curPosGeo = point(toTuple(this.props.lastPosition.coords)).geometry;
      return inside(curPosGeo, feature); 
    })[0]; // Just grab the first one
  }

  //TODO: make sure this works for MultiPolys!
  // If it doesn't, it's possible that false negatives will break LESS often
  // Than failed bloatAndSimplify operations
  bloatAndSimplify(feature) {
    // Deep clone the input to the function pure
    feature =  clone(feature);
    const coords = feature.geometry.coordinates;
    feature.geometry.coordinates = offset.data(coords).margin(0.0003); //offset the polygon
    feature.geometry = turf.simplify(feature,0.00005,false).geometry;  //simplify the offset poly
    return feature;
  }

  componentWillMount() {
    // This does an in-place grow on currentHood in order to find intersections
    // Not doing this can sometimes turn up false negatives when polies don't fully
    // overlap:
    this.bloatedHood = this.bloatAndSimplify(this.currentHood);

    this.adjacentHoods = this.features.filter(feature => {
      const curHoodFeature = this.bloatedHood;
      return intersect(curHoodFeature,feature);
    });

    // Simplifies with the D3-derived Visvalingam algorithm
    this.adjacentHoods = clone(this.adjacentHoods);
    this.adjacentHoods.forEach(feature => {
      // No multipoly check... Just want to see if this works
      let pointCount = flatten(feature.geometry.coordinates).length/2;
      feature.geometry.coordinates[0] = vis(feature.geometry.coordinates[0],pointCount*0.5);
    });

    // Alternate implementation using the Douglas-Peucker algorithm, which kind of sucks
    // this.adjacentHoods = clone(this.adjacentHoods).map(feature => {
    //   return turf.simplify(feature,0.0002,false);      
    // });

    this.filteredFeatures = this.adjacentHoods;

    this.props.setAdjacents(this.adjacentHoods);

    this.hoods = this.mapifyHoods(this.filteredFeatures);
    this.streets = this.mapifyStreets(this.props.streets);

    const currentHoodPoly = this.currentHood; 
    // Note: currentHood poly is simply the first filtered polygon, for debugging initial intersections
    this.props.setCurrentHood(currentHoodPoly); 
  }

  componentDidMount() { 

    // alert(JSON.stringify(this.props.lastPosition));

    

    // alert(JSON.stringify(this.props.currentHood));
    // const curPosGeo = point(toTuple(this.props.lastPosition.coords));
    // alert(JSON.stringify(curPosGeo));
    // const currentHoodPoly = this.filteredFeatures[0].geometry;
    // alert(JSON.stringify(currentHoodPoly));
    // const featureGeo = polygon(this.props.lastPosition);

  }

  mapifyStreets(features) {
    return features.map((feature) => {
      const coordSet = feature.geometry.coordinates;
      const latLngs = coordSet.map((coords) => ({
        longitude: coords[0],
        latitude: coords[1]
      }));
      return { 
        name: feature.properties.name,
        coords: latLngs 
      };
    });
  }

  mapifyHoods(features) {
    return features.reduce((hoods, feature) => {
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
          const latLngs = coordSet.map((coords) => ({
            longitude: coords[0],
            latitude: coords[1]
          }));
          hoods.push({ name: hoodName, coords: latLngs});
        });
      }
      return hoods;
    },[]); 
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.lastPosition !== nextProps.lastPosition);
  }
  render() {
    const features = this.features;
    const hoods = this.hoods;
    const streets = this.streets;
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
      neighborhoods: FixtureApi.getNeighborhoodBoundaries('San Francisco').data,
      streets: FixtureApi.getStreets('Tenderloin').data,
      adjacentHoods: null
    }
    this.renderMapMarkers = this.renderMapMarkers.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    this.watchID = null
    this.locations = locations
  }

  setCurrentHood(currentHood) {
    this.setState({
      currentHood: currentHood
    });
  }

  setAdjacents(adjacentHoods) {
    this.setState({ adjacentHoods });
  }

  getStreetCollisions(compassLineFeature, streetFeatures) {
    streetsAhead = [];
    streetFeatures.forEach(feature => {
      const collision = intersect(compassLineFeature, feature);
      if (!collision) return null;
      const originFeature = point(compassLineFeature.geometry.coordinates[0]);
      const collisionDistance = turf.distance(originFeature,collision);
      const street = {
        name: feature.properties.name,
        distance: collisionDistance.toFixed(2) + 'miles'  
      };
      const relations = feature.properties['@relations'];
      if (relations) {
        let routes = {};
        relations.forEach(relation => {
          if (relation.reltags.type === "route") {
            routes[relation.reltags.ref] = true;
          }
        });
        if (routes) street.routes = Object.keys(routes);
      }

      streetsAhead.push(street);
    });
    return streetsAhead;
  }

  getHoodCollisions(compassLineFeature, hoodFeatures, currentHoodFeature) {
    // return currentHoodFeature;
    var adjacents = [];
    // return compassLatLngs;
    // return compassLineFeature;
    var pointCount = 0;
    hoodFeatures.forEach(feature => {
      const collisions = intersect(compassLineFeature, feature);
      // pointCount is for debugging only; only here for easy output, very bad
      // pointCount += flatten(feature.geometry.coordinates).length/2;
      if (!collisions ||
        currentHoodFeature.properties.label === feature.properties.label) return null;

      // Possible todo: just add a label property to this object to keep it consistent?
      const type = collisions.geometry.type;
      const coords = collisions.geometry.coordinates;
      const nearestCoord = (type === 'MultiLineString') ? coords[0][0] : coords[0];
      const nearestFeature = point(nearestCoord);
      const originFeature = point(compassLineFeature.geometry.coordinates[0]);
      const collisionDistance = turf.distance(originFeature, nearestFeature, 'miles');
      // results.push({type, nearestCoord})
      // return;
      adjacents.push({
        name: feature.properties.label,
        distance: collisionDistance.toFixed(2) + ' miles'
        // point: nearestCoord
      });
    });
    return {adjacents, current: currentHoodFeature.properties.label };
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

    ReactNativeHeading.start(3)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      });
    });
    // var lame = 0;

    DeviceEventEmitter.addListener('headingUpdated', data => {
      console.log('New heading is: ', data.heading);
      // Note: buggy, needs changing
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
    const compassLineFeature = this.state.compassLine ? lineString(toTuples(this.state.compassLine)) : null;
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
            <Neighborhoods 
              compassLine={this.state.compassLine}
              setCurrentHood={this.setCurrentHood.bind(this)} 
              setAdjacents={this.setAdjacents.bind(this)}
              boundaries={this.state.neighborhoods} 
              streets={this.state.streets}
              lastPosition={this.state.lastPosition}
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
            <Text>{
              (compassLineFeature && this.state.adjacentHoods) ? 
                JSON.stringify( this.getHoodCollisions(compassLineFeature, this.state.adjacentHoods, this.state.currentHood) ) : "Just a sec..." }</Text>
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
            <Text>{ 
                // compassLineFeature ? 
                //   JSON.stringify(compassLineFeature.geometry) :
                //   'Waiting for compass line...'
                (compassLineFeature && this.state.streets) ? 
                  JSON.stringify( this.getStreetCollisions(compassLineFeature, this.state.streets) ) : "Normalizing reticulating splines..." 
            }</Text>
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

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// END: function dump

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

export default connect(mapStateToProps)(MapviewExample)
