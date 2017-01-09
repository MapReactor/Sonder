// @flow

import React, { PropTypes, Component } from 'react'
import { ScrollView, Image, BackAndroid } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/DrawerContentStyle'
import { Images } from '../Themes'
import DrawerButton from '../Components/DrawerButton'
import LoginActions, { isLoggedIn } from '../Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'

class DrawerContent extends Component {

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.context.drawer.props.open) {
        this.toggleDrawer()
        return true
      }
      return false
    })
  }

  toggleDrawer () {
    this.context.drawer.toggle()
  }

  handlePressComponents = () => {
    this.toggleDrawer()
    NavigationActions.componentExamples()
  }

  handlePressUsage = () => {
    this.toggleDrawer()
    NavigationActions.usageExamples()
  }

  handlePressCompassView = () => {
    this.toggleDrawer()
    NavigationActions.compassView()
  }

  handlePressEnRouteView = () => {
    this.toggleDrawer()
    NavigationActions.enRouteView()
  }

  handlePressStorageTestView = () => {
    this.toggleDrawer()
    NavigationActions.storageTestView()
  }

  handlePressWelcomeView = () => {
    this.toggleDrawer()
    NavigationActions.welcomeView()
  }

  handlePressFriendsView = () => {
    this.toggleDrawer()
    NavigationActions.friendsView()
  }

  handlePressLogin = () => {
    this.toggleDrawer()
    NavigationActions.login()
  }

  handlePressLogout = () => {
    this.toggleDrawer()
    this.props.logout()
  }

  renderLoginButton () {
    return (
      <DrawerButton text={I18n.t('signIn')} onPress={this.handlePressLogin} />
    )
  }

  renderLogoutButton () {
    return (
      <DrawerButton text={I18n.t('logOut')} onPress={this.handlePressLogout} />
    )
  }

  render () {
    let { loggedIn } = this.props
    return (
      <ScrollView style={styles.container}>
        <Image source={Images.logo} style={styles.logo} />
        <DrawerButton text='Sonder' onPress={this.handlePressCompassView} />
        { /* <DrawerButton text='enRoute View' onPress={this.handlePressEnRouteView} /> */ }
        { /* <DrawerButton text='*Component Examples' onPress={this.handlePressComponents} /> */ }
        { /* <DrawerButton text='Storage Test' onPress={this.handlePressStorageTestView} /> */ }
        { /* <DrawerButton text='Friends View' onPress={this.handlePressFriendsView} /> */ }
        <DrawerButton text='Logout' onPress={this.handlePressWelcomeView} />
        { /* {loggedIn ? this.renderLogoutButton() : this.renderLoginButton()} */ }
      </ScrollView>
    )
  }

}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    loggedIn: isLoggedIn(state.login)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(LoginActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent)
