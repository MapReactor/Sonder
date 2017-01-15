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
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import PopupDialog, { DialogTitle, DialogButton, SlideAnimation } from 'react-native-popup-dialog';

const accessToken = 'pk.eyJ1Ijoic2FsbW9uYXgiLCJhIjoiY2l4czY4dWVrMGFpeTJxbm5vZnNybnRrNyJ9.MUj42m1fjS1vXHFhA_OK_w';
Mapbox.setAccessToken(accessToken);

import sfSquare from '../Fixtures/sfSquare'

class MapBoxExample extends Component {
  state = {
    center: {
      longitude: -122.40258693695068,
      latitude: 37.78477457373192
    },
    zoom: 14,
    annotationClicked: false,
    rightAnnotationClicked: false,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    neighborhood: 'Tenderloin',
    wikiTitle: '',
    wikiExtract: '',
    wikiImageUrl: '',
    wikiImageWidth: 0,
    wikiImageHeight: 0,
    wikiUrl: '',
    annotations: [{
      coordinates: [37.78477457373192, -122.40258693695068],
      type: 'point',
      title: 'This is marker 1',
      subtitle: 'rightCalloutAccessory to the right. iOS only',
      rightCalloutAccessory: {
        source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
        height: 25,
        width: 25
      },
      annotationImage: {
        source: { uri: 'https://cldup.com/CnRLZem9k9.png' },
        height: 25,
        width: 25
      },
      id: 'marker1'
    }, {
      coordinates: [37.78688586205755,-122.40486145019531],
      type: 'point',
      title: 'Important!',
      subtitle: 'Neat, this is a custom annotation image',
      annotationImage: {
        source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
        height: 25,
        width: 25
      },
      id: 'marker2'
    }, {
      coordinates: [[37.78223077274647,-122.41044044494629],[37.78569032065372,-122.40604162216185],[37.78504590733613,-122.41121292114258],[37.78696217255432,-122.41153478622437]],
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: .5,
      id: 'foobar'
    }, {
      coordinates: sfSquare,
      type: 'polygon',
      title: 'This is marker 1',
      subtitle: 'rightCalloutAccessory to the right. iOS only',
      fillAlpha: 0.3,
      strokeColor: '#ffffff',
      fillColor: '#0000ff',
      id: 'sfSquare'
    }]
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
    this.state.annotationClicked === false ? this.setState({annotationClicked: true}) : this.setState({annotationClicked: false})
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    this.state.rightAnnotationClicked === false ? this.setState({rightAnnotationClicked: true}) : this.setState({rightAnnotationClicked: false})
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

  closeDialog() {
    this.popupDialog.closeDialog();
  }
  closeDialog = this.closeDialog.bind(this);

  // Fetch title, extract, and url. Return a promise that resolves with the main page image name
  fetchWikiHoodInfo = () => {
    return fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageprops|info|extracts&exintro=&explaintext=&inprop=url&titles=${this.state.neighborhood}, San_Francisco`)
      .then((response) => response.json())
      .then((responseJson) => {
        for ( var key in responseJson.query.pages) {
          let page = responseJson.query.pages[key]
          console.tron.log(page.pageprops.page_image_free)
          this.setState({wikiTitle: page.title});
          this.setState({wikiExtract: page.extract.replace(/\n/g,"\n\n")});
          this.setState({wikiUrl: page.fullurl})
          return page.pageprops.page_image_free
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  fetchWikiHoodInfo = this.fetchWikiHoodInfo.bind(this)

  // Fetch the image url, width and height of the main page url
  fetchWikiHoodImageUrl = (imageName) => {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=File:${imageName}&prop=imageinfo&iiprop=url|size&iiurlwidth=200`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.tron.log(JSON.stringify(responseJson.query.pages["-1"].imageinfo))
        for ( var key in responseJson.query.pages["-1"].imageinfo) {
          let image = responseJson.query.pages["-1"].imageinfo[key]
          this.setState({wikiImageUrl: image.thumburl});
          this.setState({wikiImageWidth: image.thumbwidth});
          this.setState({wikiImageHeight: image.thumbheight});
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  fetchWikiHoodImageUrl = this.fetchWikiHoodImageUrl.bind(this)

  getWikiHoodData = () => {
    this.fetchWikiHoodInfo()
      .then((imageName) => {
        this.fetchWikiHoodImageUrl(imageName)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getWikiHoodData = this.getWikiHoodData.bind(this)

  componentWillMount() {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress);
    });
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles);
    });
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error);
    });
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
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
      <ScrollView style={styles.scrollView}>
        {this._renderButtons()}
      </ScrollView>
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        onOpened={() => { this.getWikiHoodData(); }}
        width={.85}
        height={.75}
        dialogStyle={{padding: 10}}
        actions={[<DialogButton buttonStyle={{height: 20/*, width: 20*/, justifyContent: 'center', marginTop: 10}} textContainerStyle={{paddingVertical: 0, paddingHorizontal: 0}} textStyle={{fontSize: 12, color: 'grey', fontWeight: '300'}} text="CLOSE" align="center" onPress={this.closeDialog} key="closePopup"/>]}
        dialogTitle={<DialogTitle titleTextStyle={{fontSize: 20}} title={this.state.wikiTitle} />}
        // Disabling animations as dialogue disappears after state changes
        // see: https://github.com/jacklam718/react-native-popup-dialog/issues/19
        // dialogAnimation = { new SlideAnimation({
        //   slideFrom: 'bottom',
        //   animationDuration: 100,
        // }) }
      >
          <ScrollView>
          <View  style={{alignItems: 'center', marginHorizontal: 20}}>
            <Image style={{marginVertical: 5, resizeMode: 'contain'}} source={{uri: this.state.wikiImageUrl}} width={this.state.wikiImageWidth} height={this.state.wikiImageHeight} maintainAspectRatio={true} />
            <Text style={{fontSize: 16, textAlign: 'justify'}}>{this.state.wikiExtract}</Text>
            <Text onPress={() => {Linking.openURL("https://en.wikipedia.org/wiki/Union_Square,_San_Francisco").catch(err => console.error('An error occurred', err));}} style={{fontSize: 12, textAlign: 'left', padding: 10, color: 'blue'}}>{'Wikipedia'}</Text>
            </View>
          </ScrollView>
      </PopupDialog>
      </View>
    );
  }

  _renderButtons() {
    return (
      <View>
        <Text onPress={() => this.popupDialog.openDialog()}>
          Toggle Wiki popup
        </Text>
        <Text onPress={() => this.getWikiHoodData()}>
          Toggle getWiki Hood Data
        </Text>
        <Text>
          Wiki Title: {this.state.wikiTitle}{"\n"}
          Wiki Extract: {this.state.wikiExtract}{"\n"}
          Wiki Image Url: {this.state.wikiImageUrl}{"\n"}
          Wiki Image Width: {this.state.wikiImageWidth}{"\n"}
          Wiki Image Height: {this.state.wikiImageHeight}{"\n"}
          Wiki Url: {this.state.wikiUrl}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
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

export default connect(mapStateToProps)(MapBoxExample)
