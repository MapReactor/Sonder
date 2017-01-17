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
import { getPrettyBearing, toTuples } from '../Lib/MapHelpers'
import Immutable from 'seamless-immutable'
import FriendsHelpers from '../Lib/FriendsHelpers'


const accessToken = 'pk.eyJ1Ijoic2FsbW9uYXgiLCJhIjoiY2l4czY4dWVrMGFpeTJxbm5vZnNybnRrNyJ9.MUj42m1fjS1vXHFhA_OK_w';
Mapbox.setAccessToken(accessToken);

class FriendsView extends Component {
  constructor (props) {
    super(props);
  }

  state = {
    center: {
      latitude: 37.78477457373192,
      longitude: -122.40258693695068
    },
    zoom: 11,
    userTrackingMode: Mapbox.userTrackingMode.none,
    annotations: [
    {
      coordinates: [37.78477457373192, -122.40258693695068],
      type: 'point',
      title: 'Original marker',
      id: 'marker',
    }
  ],
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
      onHeadingSupported: (headingIsSupported) =>
        this.setState({ headingIsSupported }),
      onPositionChange: (lastPosition) =>
        this.setState({ lastPosition }),
      onHeadingChange: (headingData) =>
        this._map.setDirection(headingData.heading),
      onEntitiesDetected: (entities) =>
        this.setState({ entities })
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
          showsUserLocation={true}
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
});

export default connect(mapStateToProps)(FriendsView)
