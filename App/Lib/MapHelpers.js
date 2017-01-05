// @flow

import R from 'ramda'

export const removeEmpty = (markers: Array<Object>) => {
  let filteredMarkers = R.filter((item) => {
    return item.latitude && item.longitude
  }, markers)
  return filteredMarkers
}

// This returns an array of tuples in geoJSON format representing the region
// rectangle. ie. [[longitude, latitude]...]
export const getRegionBBox = (region: Object) => {
  const middleLong = region.longitude;
  const middleLat = region.latitude;
  const longDelta = region.longitudeDelta;
  const latDelta = region.latitudeDelta;
  
  const maxX = middleLong+longDelta;
  const minX = middleLong-longDelta;
  
  const maxY = middleLat+latDelta;
  const minY = middleLat-latDelta;
  // return region
  
  // Return rectangle ordered CCW from bottom right corner
  return [[maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]];
}

export const toCoords = (geojson: Array<Array>) => geojson.map((tuple) => ({
    longitude: tuple[0], 
    latitude: tuple[1]
  })
);

export const toTuple = (coord: Object) => [coord.longitude, coord.latitude];

export const toTuples = (coords: Array<Object>) => coords.map((coords) => [coords.longitude, coords.latitude])

export const calculateRegion = (locations: Array<Object>, options: Object) => {
  const latPadding = options && options.latPadding ? options.latPadding : 0.1
  const longPadding = options && options.longPadding ? options.longPadding : 0.1
  const mapLocations = removeEmpty(locations)
  // Only do calculations if there are locations
  if (mapLocations.length > 0) {
    let allLatitudes = R.map((l) => {
      if (l.latitude && !l.latitude.isNaN) return l.latitude
    }, mapLocations)

    let allLongitudes = R.map((l) => {
      if (l.longitude && !l.longitude.isNaN) return l.longitude
    }, mapLocations)

    let minLat = R.reduce(R.min, Infinity, allLatitudes)
    let maxLat = R.reduce(R.max, -Infinity, allLatitudes)
    let minLong = R.reduce(R.min, Infinity, allLongitudes)
    let maxLong = R.reduce(R.max, -Infinity, allLongitudes)

    let middleLat = (minLat + maxLat) / 2
    let middleLong = (minLong + maxLong) / 2
    let latDelta = (maxLat - minLat) + latPadding
    let longDelta = (maxLong - minLong) + longPadding

    // return markers
    return {
      latitude: middleLat,
      longitude: middleLong,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta
    }
  }
}
