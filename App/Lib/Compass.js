/* 
First-pass refactor of monolithic compass
------------------------------------------
ToDos:
- Put promises everywhere
- Make it work with batching optimizations,
    or use requestAnimationFrame, or something
- Refactor the neighborhood stuff out of here
- Add isReady() helper functions to go along with events
- Unit tests
*/

import { DeviceEventEmitter } from 'react-native';
import ReactNativeHeading from 'react-native-heading';
// Note: ignoring redux-saga structure for now, so this eventually shouldn't go in here!
import FixtureApi from '../Services/FixtureApi';

import { getRegionBBox, toCoords, toTuples, toTuple } from '../Lib/MapHelpers';
import { lineString, point, polygon } from '@turf/helpers';
import intersect from '@turf/intersect';
import inside from '@turf/inside';
import Offset from 'polygon-offset';
import turf from '@turf/turf';

import { clone } from 'cloneextend';
import vis from 'code42day-vis-why';
const offset = new Offset();

const toRadians = (heading) => heading * (Math.PI / 180);
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

class Compass {
  constructor() {
    // Set individual event hook function definitions
    this.EVENTS = [ 'onInitialPosition', 
                    'onPositionChange', 
                    'onHeadingSupported',
                    'onHeadingChange',
                    'onCompassReady',
                    'onInitialHoods',
                    'onEntitiesDetected'];
    this.EVENTS.forEach(event => {
      this['_'+event] = () => {};
      this[event] = (func) => { 
        this['_'+event] = (typeof func === 'function') ?
          func : () => {};
      }
    });
    this.entities = {};
    this._currentPosition = null;
    this._heading = null;
  }
  getDebugHoods() {
    return FixtureApi.getNeighborhoodBoundaries('San Francisco').data;
  }
  getDebugStreets() {
    return FixtureApi.getStreets('Tenderloin').data;
  }

  _setEvents(opts) {
    this.EVENTS.forEach(event => {
      if (typeof opts[event] === 'function') {
        this['_'+event] = opts[event];
      } 
    });
  }

  start(opts) {
    /* ToDos: 
       - Probably start() should be thenable and onInitialPosition 
          and onHeadingSupported deprecated.
       - getCurrent and watchPosition should probably use Promise.race
        right now, presumes that no movement is happening on init
    */
    this._setEvents(opts);
    this._radius = opts.radius || 10;

    const getInitialPosition = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!this._currentPosition) this._currentPosition = position.coords;
          this._onInitialPosition(position);
          resolve(position);
        },
        (error) => reject('Location timed out')
      );
    });
    getInitialPosition
      .then(position => this._processNeighborhoods(position))
      .then(hoodData => this._onInitialHoods(hoodData));

    this.watchID = navigator.geolocation.watchPosition(position => {
      this._currentPosition = position.coords;
      this._onPositionChange(position);
    });

    ReactNativeHeading.start(opts.minAngle || 1)
    .then(didStart => this._onHeadingSupported(didStart));

    DeviceEventEmitter.addListener('headingUpdated', data => {
      const heading = this._heading = data.heading;
      const compassLine = this._compassLine = this.getCompassLine();
      this._onHeadingChange({ heading, compassLine });
      if (!compassLine) return;
      this._detectEntities(heading).then(entities => {
        this._onEntitiesDetected(entities);
      });

    });
  }

  getCompassLine(heading = this._heading, 
                 radius = this._radius,
                 origin = this._currentPosition) {
    if (!origin) return null;
    const headingInRadians = toRadians(heading);
    // alert(JSON.stringify({ heading, radius, origin }));
    return [origin, {
        longitude: origin.longitude + radius * Math.sin(headingInRadians),
        latitude: origin.latitude + radius * Math.cos(headingInRadians)
      }];
  }

  _detectEntities(heading) {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve({ 
          hoods: this.getHoodCollisions(),
          streets: this.getStreetCollisions()
        });
      },0);
    });
  }

  _getCompassLineFeature() {
    return lineString(toTuples(this._compassLine));
  }

  // Probably just wrap this in a requestAnimationFrame for now
  getHoodCollisions(compassLineFeature = this._getCompassLineFeature(),
                    adjacentHoods = this._hoodData.adjacentHoods, 
                    currentHood = this._hoodData.currentHood) {
    // return currentHood;
    var adjacents = [];
    // return compassLatLngs;
    // return compassLineFeature;
    var pointCount = 0;
    adjacentHoods.forEach(feature => {
      const collisions = intersect(compassLineFeature, feature);
      // pointCount is for debugging only; only here for easy output, very bad
      // pointCount += flatten(feature.geometry.coordinates).length/2;
      if (!collisions ||
        currentHood.properties.label === feature.properties.label) return null;

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
    return {adjacents, current: currentHood.properties.label };
  } 

  getStreetCollisions(compassLineFeature = this._getCompassLineFeature(), 
                      streetsFixture = this.getDebugStreets() ) {
    streetsAhead = [];
    streetsFixture.forEach(feature => {
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

  _processNeighborhoods(position) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rawHoods = this.getDebugHoods();
        const streets = this.getDebugStreets();
        // The rest might end up as instance variables:
        const currentHood = this._findCurrentHood(position, rawHoods.features);
        const adjacentHoods = this._findAdjacentHoods(currentHood, rawHoods.features);
        const hoodLatLngs = this.mapifyHoods(adjacentHoods);
        const streetLatLngs = this.mapifyStreets(streets);
        this._hoodData = { currentHood, adjacentHoods, hoodLatLngs, streetLatLngs };
        resolve(this._hoodData);
      },0);
    });

    // WARNING: this will *definitely* need to be done asynchronously!
    // Just grabbing them badly for first refactor

  }

  _findCurrentHood(position, hoodFeatures) {
    return hoodFeatures.filter(feature => {
      const curPosGeo = point(toTuple(position.coords)).geometry;
      return inside(curPosGeo, feature);
    })[0];
  }

  _findAdjacentHoods(currentHood, hoodFeatures) {
    // This does an in-place grow on currentHood in order to find intersections
    // Not doing this can sometimes turn up false negatives when polys
    // don't fully overlap.
    // Note: Not yet working with MultiPolys.
    const bloatedHood = this.bloatAndSimplify(currentHood);
    let adjacentHoods = hoodFeatures.filter(feature => {
      return intersect(bloatedHood, feature);
    });
    // Simplifies with the D3-derived Visvalingam algorithm
    // Clone first to avoid changing source data
    adjacentHoods = clone(adjacentHoods);
    adjacentHoods.forEach(feature => {
      // No MultiPoly check... Just want to see if this works
      let pointCount = flatten(feature.geometry.coordinates).length/2;
      feature.geometry.coordinates[0] = vis(feature.geometry.coordinates[0],pointCount*0.5);
    });
    // Alternate implementation using the Douglas-Peucker algorithm, 
    // which doesn't work quite as well:
    // adjacentHoods = clone(adjacentHoods).map(feature => {
    //   return turf.simplify(feature,0.0002,false);      
    // });
    return adjacentHoods;
  }

  stop() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');
    navigator.geolocation.clearWatch(this.watchID);
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
}

const compass = new Compass();

// Can't freeze this because the object overwrites its own methods
// at runtime; probably won't matter:
// Object.freeze(compass);

export default compass;