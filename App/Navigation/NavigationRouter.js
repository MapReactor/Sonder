// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
// import NavItems from './NavItems'

// screens identified by the router
import MapViewExample from '../Containers/MapViewExample'
// import CompassView from '../Containers/CompassView'
import WelcomeView from '../Containers/WelcomeView'
import StorageTestView from '../Containers/StorageTestView'
import FriendsView from '../Containers/FriendsView'
import SonderView from '../Containers/SonderView'
import MapBoxExample from '../Containers/MapBoxExample'
import MapBoxExampleSf from '../Containers/MapBoxExampleSf'
import SonderDebug from '../Containers/SonderDebug'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene key='welcomeView' hideNavBar={false} component={WelcomeView} />
            <Scene key='sonderView' component={SonderView} title='Sonder' />
            {/* <Scene key='compassView' hideNavBar={false} component={CompassView} title='Compass (deprecated)' />*/}
            <Scene key='mapBoxExampleView' component={MapBoxExample} title='MapBox Example' />
            <Scene key='mapBoxExampleSfView' component={MapBoxExampleSf} title='MapBox Example SF' />
            <Scene key='storageTestView' hideNavBar={false} component={StorageTestView} title='Storage Test' />
            <Scene initial key='friendsView' hideNavBar={false} component={FriendsView} title='Friends View' />
            <Scene key='sonderDebug' component={SonderDebug} title='Sonder Data Debug' />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
