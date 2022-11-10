import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Image, Dimensions } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { inviteStyles } from '../Invite/InviteDetailsStyle';
import { BLUE_MAIN, BLUE_DARK, VIOLET_MAIN } from '../../shared/colorPalette';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import * as jobActions from './actions';
import jobStore from './JobStore';
import { JobDetails } from '../../shared/components';
import { LOG } from '../../shared';
import { Loading, openMapsApp, CustomToast } from '../../shared/components';
import MARKER_IMG from '../../assets/image/map-marker.png';
import { RATE_EMPLOYER_ROUTE } from '../../constants/routes';
import moment from 'moment';
import { ModalHeader } from '../../shared/components/ModalHeader';
import { _round, clockInMixin, clockOutMixin } from '../../shared/mixins';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_LATIDUDE = 25.761681;
const DEFAULT_LONGITUDE = -80.191788;

/**
 * @deprecated use UpcomingJobScreen instead
 */
class JobDetailsScreen extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: i18next.t('JOB_INVITES.inviteDetails'),
    tabBarIcon: () => (
      <Image
        style={{ resizeMode: 'contain', height: 30 }}
        source={require('../../assets/image/preferences.png')}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      shift: undefined,
      region: {
        latitude: DEFAULT_LATIDUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      jobRate: null,
      clockIns: null,
      shiftId: props.navigation.getParam('shiftId', null),
      applicationId: props.navigation.getParam('applicationId', null),
    };
    this.clockIn = clockInMixin.bind(this);
    this.clockOut = clockOutMixin.bind(this);
    this.watchId = null;
    this.latitude = 0.0;
    this.longitude = 0.0;
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.getApplicationSubscription = jobStore.subscribe(
      'GetApplication',
      this.getJobHandler,
    );
    this.getJobRateSubscription = jobStore.subscribe(
      'GetJobRate',
      this.getJobRateHandler,
    );
    this.clockInSubscription = jobStore.subscribe(
      'ClockIn',
      this.clockInHandler,
    );
    this.clockOutSubscription = jobStore.subscribe(
      'ClockOut',
      this.clockOutHandler,
    );
    this.getClockInsSubscription = jobStore.subscribe(
      'GetClockins',
      this.getClockInsHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
    this.getJobOrApplication();
    //
    navigator.geolocation.getCurrentPosition(
      (newPosition) => {
        console.log('DEBUG:position:current:', newPosition.coords);
        this.latitude = _round(newPosition.coords.latitude);
        this.longitude = _round(newPosition.coords.longitude);
      },
      (error) => {
        console.log('DEBUG:error:current::', error);
      },
    );

    this.watchId = navigator.geolocation.watchPosition(
      (newPosition) => {
        console.log('DEBUG:position:', newPosition.coords);
        this.latitude = _round(newPosition.coords.latitude);
        this.longitude = _round(newPosition.coords.longitude);
      },
      (error) => {
        console.log('DEBUG:error:', error);
      },
      { maximumAge: 1000, enableHighAccuracy: true },
    );
  }

  componentWillUnmount() {
    this.getJobSubscription.unsubscribe();
    this.getApplicationSubscription.unsubscribe();
    this.getJobRateSubscription.unsubscribe();
    this.clockInSubscription.unsubscribe();
    this.clockOutSubscription.unsubscribe();
    this.getClockInsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
    navigator.geolocation.clearWatch(this.watchId);
  }

  getJobHandler = (shift) => {
    let latitude;
    let longitude;

    try {
      latitude = shift.venue.latitude || DEFAULT_LATIDUDE;
      longitude = shift.venue.longitude || DEFAULT_LONGITUDE;
    } catch (e) {
      LOG(this, `No latLng: ${JSON.stringify(e)}`);

      latitude = DEFAULT_LATIDUDE;
      longitude = DEFAULT_LONGITUDE;
    }

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    this.setState({ shift, isLoading: false }, () => {
      this.onRegionChangeComplete(region);
    });
  };

  getJobRateHandler = (jobRate) => {
    this.setState({ jobRate });
  };

  getClockInsHandler = (clockIns) => {
    this.setState({ clockIns });
  };

  clockInHandler = () => {
    this.setState({ isLoading: false });
    CustomToast(i18next.t('MY_JOBS.clockedIn'));
    this.getClockins();
  };

  clockOutHandler = () => {
    this.setState({ isLoading: false });
    CustomToast(i18next.t('MY_JOBS.clockedOut'));
    this.getClockins();
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <I18n>
        {(t) => (
          <Container>
            {this.state.isLoading ? <Loading /> : null}
            <ModalHeader screenName="jobDetails" title={'Job'} />
            <Content>
              <View style={inviteStyles.viewShift}>
                {this.state.shift ? (
                  <JobDetails shift={this.state.shift} />
                ) : null}
              </View>
              <MapView
                style={inviteStyles.map}
                region={this.state.region}
                onRegionChangeComplete={this.onRegionChangeComplete}>
                {this.showMarker() ? (
                  <Marker
                    image={MARKER_IMG}
                    anchor={{ x: 0.5, y: 1 }}
                    coordinate={{
                      latitude: this.state.shift.venue.latitude,
                      longitude: this.state.shift.venue.longitude,
                    }}
                    title={this.state.shift.venue.title}
                  />
                ) : (
                  <Marker
                    image={MARKER_IMG}
                    anchor={{ x: 0.5, y: 1 }}
                    coordinate={{
                      latitude: DEFAULT_LATIDUDE,
                      longitude: DEFAULT_LONGITUDE,
                    }}
                  />
                )}
              </MapView>

              {this.showOpenDirection() ? (
                <View>
                  <Text style={inviteStyles.textLocation}>
                    {`${this.state.shift.venue.title}`}
                  </Text>
                  <Button
                    rounded
                    small
                    bordered
                    style={inviteStyles.openDirectionButton}
                    onPress={this.openMapsApp}>
                    <Text style={{ color: BLUE_DARK }}>
                      {t('JOB_INVITES.openDirection')}
                    </Text>
                  </Button>
                </View>
              ) : null}

              <View style={inviteStyles.viewShift}>
                {this.showAlreadyRated() ? (
                  <View>
                    <Text style={inviteStyles.textAlreadyRated}>
                      {`${t('MY_JOBS.alreadyRated')}`}
                    </Text>
                  </View>
                ) : null}

                {this.showRateButton() ? (
                  <Button
                    block
                    rounded
                    style={{
                      marginVertical: 15,
                      backgroundColor: BLUE_MAIN,
                    }}
                    onPress={this.goToRateJob}>
                    <Text>{t('MY_JOBS.rateYourEmployer')}</Text>
                  </Button>
                ) : null}

                {this.showClockInButton() ? (
                  <Button
                    block
                    rounded
                    style={{
                      marginVertical: 15,
                      backgroundColor: BLUE_DARK,
                    }}
                    onPress={this.clockIn}>
                    <Text>{t('MY_JOBS.clockIn')}</Text>
                  </Button>
                ) : null}

                {this.showClockOutButton() ? (
                  <Button
                    block
                    // rounded
                    style={{
                      marginVertical: 15,
                      backgroundColor: VIOLET_MAIN,
                    }}
                    onPress={this.clockOut}>
                    <Text>{t('MY_JOBS.clockOut')}</Text>
                  </Button>
                ) : null}
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  showOpenDirection = () => {
    try {
      if (this.state.shift.venue.title) return true;
    } catch (err) {
      return false;
    }

    return false;
  };

  showMarker = () => {
    try {
      if (this.state.shift.venue.longitude && this.state.shift.venue.latitude) {
        return true;
      }
    } catch (err) {
      return false;
    }

    return false;
  };

  showRateButton = () => {
    if (!this.state.shift) return false;

    // check if current time is before ending_at
    if (moment.utc().isSameOrBefore(moment.utc(this.state.shift.ending_at))) {
      return false;
    }

    // check for missing clockouts or clockins
    if (Array.isArray(this.state.clockIns)) {
      if (!this.state.clockIns.length) return false;

      const endedAt = this.state.clockIns[this.state.clockIns.length - 1]
        .ended_at;

      if (!endedAt) {
        return false;
      }
    } else return false; // dont show rate button until clockins are loaded

    if (Array.isArray(this.state.jobRate) && !this.state.jobRate.length) {
      return true;
    }

    return false;
  };

  showAlreadyRated = () => {
    if (!this.state.shift) return false;

    if (Array.isArray(this.state.jobRate) && this.state.jobRate.length) {
      return true;
    }

    return false;
  };

  showClockInButton = () => {
    if (!this.state.shift) return false;

    // check if current time is after ending_at
    if (moment.utc().isSameOrAfter(moment.utc(this.state.shift.ending_at))) {
      return false;
    }

    /**
     * Diff in minutes from current time to starting_at parsed to positive
     * to check the delta time
     * @type {number}
     */
    const diffInMinutes = Math.abs(
      moment.utc().diff(moment.utc(this.state.shift.starting_at), 'minutes'),
    );

    if (Array.isArray(this.state.clockIns)) {
      if (!this.state.clockIns.length) {
        // delta time checking for the first clockIn only
        if (
          this.state.shift.maximum_clockin_delta_minutes !== null &&
          diffInMinutes >= this.state.shift.maximum_clockin_delta_minutes
        ) {
          return false;
        }

        return true;
      }

      const endedAt = this.state.clockIns[this.state.clockIns.length - 1]
        .ended_at;

      if (endedAt) {
        return true;
      }
    }

    return false;
  };

  showClockOutButton = () => {
    if (!this.state.shift) return false;

    if (Array.isArray(this.state.clockIns)) {
      if (!this.state.clockIns.length) return false;

      const startedAt = this.state.clockIns[this.state.clockIns.length - 1]
        .started_at;
      const endedAt = this.state.clockIns[this.state.clockIns.length - 1]
        .ended_at;

      if (startedAt && !endedAt) {
        return true;
      }
    }

    return false;
  };

  openMapsApp = () => {
    let latitude;
    let longitude;

    try {
      latitude = this.state.shift.venue.latitude || DEFAULT_LATIDUDE;
      longitude = this.state.shift.venue.longitude || DEFAULT_LONGITUDE;
    } catch (e) {
      latitude = DEFAULT_LATIDUDE;
      longitude = DEFAULT_LONGITUDE;
    }

    openMapsApp(latitude, longitude);
  };

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  };

  getJobOrApplication = () => {
    if (!this.state.shiftId && !this.state.applicationId) {
      return this.props.navigation.goBack();
    }

    if (this.state.shiftId) {
      return this.setState({ isLoading: true }, () => {
        this.getJobRate();
        this.getClockins();
        jobActions.getJob(this.state.shiftId);
      });
    }

    if (this.state.applicationId) {
      return this.setState({ isLoading: true }, () => {
        jobActions.getApplication(this.state.applicationId);
      });
    }
  };

  getJobRate = () => {
    jobActions.getJobRate(this.state.shiftId);
  };

  getClockins = () => {
    jobActions.getClockins(this.state.shiftId);
  };

  goToRateJob = () => {
    if (!this.state.shiftId || !this.state.shift || !this.state.shift.id) {
      return;
    }

    this.props.navigation.navigate(RATE_EMPLOYER_ROUTE, {
      shift: this.state.shift,
    });
  };
}

export default JobDetailsScreen;
