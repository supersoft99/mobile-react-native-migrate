import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  APP_ROUTE,
  AUTH_ROUTE,
  POSITION_ONBOARDING_ROUTE,
} from '../../constants/routes';
import store from '../Account/AccountStore';
import DeviceInfo from 'react-native-device-info';
import { LOG } from '../../shared';
import accountStore from '../Account/AccountStore';
import * as accountActions from '../Account/actions';
import checkVersionApp from './actions';
import SPLASH_IMG from '../../assets/image/splash.png';

class Splash extends Component {
  state = {
    currentVersion: DeviceInfo.getBuildNumber(),
  };
  componentDidMount() {
    const { currentVersion } = this.state;
    const { navigation } = this.props;

    checkVersionApp(currentVersion, navigation);
    setTimeout(() => {
      this._bootstrapAsync();
    }, 1000);

    this.loginSubscription = accountStore.subscribe('Login', (user) =>
      this.loginHandler(user),
    );
  }

  componentWillUnmount() {
    this.loginSubscription.unsubscribe();
  }

  loginHandler = async (user) => {
    let status;
    let token;

    try {
      token = user.token;
      status = user.user.profile.status;
    } catch (e) {
      LOG(this, e);
    }

    if (token && status && status === 'PAUSED') {
      return this.props.navigation.navigate(POSITION_ONBOARDING_ROUTE);
    }
    if (token && status && status === 'ACTIVE') {
      return this.props.navigation.navigate(APP_ROUTE);
    }

    this.props.navigation.navigate(AUTH_ROUTE);
  };

  // Fetch the token from AsycnStorage/FluxState then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let userData = await store.getState('Login');

    if (!userData || !userData.token) {
      const userString = await AsyncStorage.getItem('user');

      try {
        userData = JSON.parse(userString);
      } catch (e) {
        LOG(this, e);
      }
    }

    accountActions.setStoredUser(userData || {});
  };

  // Render any loading content that you like here
  render() {
    return <ImageBackground source={SPLASH_IMG} style={styles.imgSplash} />;
  }
}

export default Splash;

const styles = StyleSheet.create({
  imgSplash: { width: '100%', height: '100%' },
});
