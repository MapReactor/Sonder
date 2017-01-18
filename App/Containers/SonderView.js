'use strict';
/* eslint no-console: 0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView
} from 'react-native';

import Styles from './Styles/MapViewStyle'
import Compass from '../Lib/Compass'
import { reverseTuples, getPrettyBearing, toTuples } from '../Lib/MapHelpers'
import FriendsHelpers from '../Lib/FriendsHelpers'


const accessToken = 'pk.eyJ1Ijoic2FsbW9uYXgiLCJhIjoiY2l4czY4dWVrMGFpeTJxbm5vZnNybnRrNyJ9.MUj42m1fjS1vXHFhA_OK_w';
Mapbox.setAccessToken(accessToken);

class SonderView extends Component {
  state = {
    zoom: 12,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    annotations: [],
    // center: {
    //   longitude: -122.40258693695068,
    //   latitude: 37.78477457373192
    // },
  };

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };

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
          streets: streetLatLngs,
        });
      },
      onHeadingSupported: (headingIsSupported) =>
        this.setState({ headingIsSupported }),
      onPositionChange: (lastPosition) =>
        this.setState({ lastPosition }),
      onHeadingChange: (headingData) => {
        this.setCompassAnnotation(headingData)
        this.setAdjacentHoodAnnotation()
      },
      onEntitiesDetected: (entities) => {
        this.setState({ entities });
        this.setCurrentHoodAnnotation();
        this.setAdjacentHoodAnnotation();
      }
    });
  }

  componentWillUnmount() {
    Compass.stop();
  }

  componentWillReceiveProps(nextProps) {
    // annotations change dynamically based on changes in friendsLocations
    this.setState((prevState, props) => {
      return FriendsHelpers.updateFriendsLocations(nextProps, prevState)
    })
  }

  setCompassAnnotation(headingData) {
    let compassTuple = toTuples(headingData.compassLine);
    compassTuple = [compassTuple[0].reverse(), compassTuple[1].reverse()]
    if (!this.state.annotations[0]) {
      this.setState({
        heading: headingData.heading,
        annotations: [{
          id: 'compassLine',
          coordinates: compassTuple,
          type: 'polyline',
          strokeColor: '#00FB00',
          strokeWidth: 4,
          strokeAlpha: .5
        }]
      });
    } else {
      this.setState({
        heading: headingData.heading,
        annotations: this.state.annotations.map(annotation =>
          (annotation.id !== 'compassLine') ?
            annotation :
            Object.assign({},annotation,{ coordinates: compassTuple })
        )
      });
    }
  }

  setCurrentHoodAnnotation() {
    if (!this.state.entities) {
      return
    }
    let annotations = this.state.annotations.slice();
    annotations[1] = {
      coordinates: reverseTuples(this.state.entities.hoods.current.coordinates[0]),
      type: 'polygon',
      fillAlpha: 0.3,
      strokeColor: '#ffffff',
      fillColor: '#0000ff',
      id: 'currentHood'
    }
    this.setState({
      annotations: annotations
    })
  }


  setAdjacentHoodAnnotation() {
    if (!this.state.entities) {
      return
    }
    let coordinates = this.state.entities.hoods.adjacents
      .reduce((closestHood, hood) => hood.distance < closestHood.distance ?
        hood : closestHood
      )
      .coordinates[0]
    let annotations = this.state.annotations.slice();
    annotations[2] = {
      // coordinates: [[37.78760656916262,-122.40668535232543],[37.787420033880174,-122.40835905075073],[37.78830183288528,-122.40853071212767],[37.78850532346909,-122.4068784713745],[37.78760656916262,-122.40668535232543]],
      coordinates: reverseTuples(coordinates),
      type: 'polygon',
      fillAlpha: 0.3,
      strokeColor: '#00e6e6',
      fillColor: '#00e6e6',
      id: 'adjacentHood'
    }
    this.setState({
      annotations: annotations
    })
  }

  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.streets}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
          <View style={{ maxHeight: 200 }}>
            <ScrollView>
              <Text>{this.state.entities ?
                '*** this.state.entities.hoods: ' + JSON.stringify(this.state.entities.hoods) :
                "Waiting for entities..."}
              </Text>
              <Text>{this.state.headingIsSupported ?
                '*** this.state.heading: ' + getPrettyBearing(this.state.heading) :
                "Heading unsupported." }
              </Text>
              <Text>{this.state.entities ?
                '*** this.state.entities.streets: ' + JSON.stringify(this.state.entities.streets) :
                "Normalizing reticulating splines..."}
              </Text>
              <Text>{this.state.annotations ?
                '*** this.state.annotations: ' + JSON.stringify( this.state.annotations ) :
                null}
              </Text>
            </ScrollView>
          </View>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    friendsLocations: state.friendsLocations
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});

export default connect(mapStateToProps)(SonderView)
