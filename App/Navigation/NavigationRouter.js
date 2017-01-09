// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
// import NavItems from './NavItems'

// screens identified by the router
import AllComponentsScreen from '../Containers/AllComponentsScreen'
import LoginScreen from '../Containers/LoginScreen'

import MapViewExample from '../Containers/MapViewExample'
import CompassView from '../Containers/CompassView'
import EnRouteView from '../Containers/EnRouteView'
import WelcomeView from '../Containers/WelcomeView'
import StorageTestView from '../Containers/StorageTestView'
import FriendsView from '../Containers/FriendsView'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='welcomeView' component={WelcomeView} title='Welcome View' />
            <Scene key='compassView' component={CompassView} title='Sonder' />
            <Scene key='enRouteView' component={EnRouteView} title='En Route View' />
            <Scene key='componentExamples' component={AllComponentsScreen} title='Components' />
            <Scene key='storageTestView' component={StorageTestView} title='Storage Test' />
            <Scene key='friendsView' component={FriendsView} title='Friends View' />
            <Scene key='welcomeView' component={WelcomeView} title='' />
            <Scene key='login' component={LoginScreen} title='Login' hideNavBar />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
