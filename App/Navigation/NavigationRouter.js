// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
// import NavItems from './NavItems'

// screens identified by the router
import AllComponentsScreen from '../Containers/AllComponentsScreen'
import LoginScreen from '../Containers/LoginScreen'

import MapviewExample from '../Containers/MapviewExample'
import CompassView from '../Containers/CompassView'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene key='componentExamples' component={AllComponentsScreen} title='Components' />
            <Scene key='login' component={LoginScreen} title='Login' hideNavBar />
            <Scene initial key='mapviewExample' component={MapviewExample} title='Mapview Example' />
            <Scene initial key='compassView' component={CompassView} title='Compass View' />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
