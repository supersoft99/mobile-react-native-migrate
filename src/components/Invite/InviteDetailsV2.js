import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, Dimensions, View, ScrollView, Linking } from 'react-native';
import { Button, Container, Text } from 'native-base';
import { inviteStyles } from './InviteDetailsStyle';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import * as inviteActions from './actions';
import { ViewFlex } from '../../shared/components/ViewFlex';
import { LOG } from '../../shared';
import { Loading, openMapsApp } from '../../shared/components';
import MARKER_IMG from '../../assets/image/map-marker.png';
import { ModalHeader } from '../../shared/components/ModalHeader';
import { JobInformation } from '../../shared/components/JobInformation';
import inviteStore from './InviteStore';
import moment from 'moment';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_LATITUDE = 25.761681;
const DEFAULT_LONGITUDE = -80.191788;

class InviteDetailsV2 extends Component {
  // static navigationOptions = {
  //   header: null,
  //   tabBarLabel: i18next.t('JOB_INVITES.inviteDetails'),
  //   tabBarIcon: () => (
  //     <Image
  //       style={{ resizeMode: 'contain', height: 30 }}
  //       source={require('../../assets/image/preferences.png')}
  //     />
  //   ),
  // };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      invite: {},
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      inviteId: props.navigation.getParam('inviteId', 'NO_ID'),
    };
  }

  componentDidMount() {
    this.getInviteSubscription = inviteStore.subscribe('GetInvite', (invite) =>
      this.getInviteHandler(invite),
    );
    this.applyJobSubscription = inviteStore.subscribe('ApplyJob', (data) =>
      this.applyJobHandler(data),
    );
    this.rejectJobSubscription = inviteStore.subscribe('RejectJob', (data) =>
      this.rejectJobHandler(data),
    );
    this.inviteStoreError = inviteStore.subscribe('InviteStoreError', (err) =>
      this.errorHandler(err),
    );
    this.getInvite();
  }

  componentWillUnmount() {
    this.getInviteSubscription.unsubscribe();
    this.applyJobSubscription.unsubscribe();
    this.rejectJobSubscription.unsubscribe();
    this.inviteStoreError.unsubscribe();
  }

  getInviteHandler = (invite) => {
    let latitude;
    let longitude;

    try {
      latitude = invite.shift.venue.latitude || DEFAULT_LATITUDE;
      longitude = invite.shift.venue.longitude || DEFAULT_LONGITUDE;
    } catch (e) {
      LOG(this, `No latLng: ${JSON.stringify(e)}`);

      latitude = DEFAULT_LATITUDE;
      longitude = DEFAULT_LONGITUDE;
    }

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    this.setState({ invite, isLoading: false }, () => {
      this.onRegionChangeComplete(region);
    });
  };

  applyJobHandler = () => {
    this.isLoading(false);
    this.props.navigation.goBack();
  };

  rejectJobHandler = () => {
    this.isLoading(false);
    this.props.navigation.goBack();
  };

  errorHandler = () => {
    this.isLoading(false);
  };

  render() {
    const { isLoading, invite } = this.state;
    console.log('this state', this.state);
    const renderInvite = (t, invite) => {
      const { shift } = invite;
      return (
        <>
          <ModalHeader title={t('JOB_INVITES.inviteDetails')} />
          <ViewFlex justifyContent={'space-between'}>
            <ScrollView>
              <JobInformation
                shift={shift}
                onPressDirection={
                  this.showOpenDirection() ? this.openMapsApp : () => {}
                }
              />
              <MapView
                style={inviteStyles.map}
                region={this.state.region}
                onRegionChangeComplete={this.onRegionChangeComplete}>
                {this.showMarker() ? (
                  <Marker
                    image={MARKER_IMG}
                    anchor={{ x: 0.5, y: 1 }}
                    coordinate={{
                      latitude: shift.venue.latitude,
                      longitude: shift.venue.longitude,
                    }}
                    title={shift.venue.title}
                  />
                ) : (
                  <Marker
                    image={MARKER_IMG}
                    anchor={{ x: 0.5, y: 1 }}
                    coordinate={{
                      latitude: DEFAULT_LATITUDE,
                      longitude: DEFAULT_LONGITUDE,
                    }}
                  />
                )}
              </MapView>
              <View style={inviteStyles.viewCrud}>
                <View style={inviteStyles.viewButtomLeft}>
                  <Button
                    onPress={this.rejectJob}
                    style={inviteStyles.buttomLeft}
                    full
                    // rounded
                    bordered>
                    <Text style={inviteStyles.textBlack}>
                      {t('JOB_INVITES.reject')}
                    </Text>
                  </Button>
                </View>
                <View style={inviteStyles.viewButtomRight}>
                  <Button
                    title={''}
                    onPress={this.applyJob}
                    style={inviteStyles.buttomRight}
                    full
                    // rounded
                    bordered>
                    <Text style={inviteStyles.textWhite}>
                      {t('JOB_INVITES.apply')}
                    </Text>
                  </Button>
                </View>
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15,
                }}>
                By you applying, you agree to the{' '}
                <Text
                  style={{ color: 'blue' }}
                  onPress={() => {
                    if (invite && invite.sender === 1) {
                      Linking.openURL(
                        'https://res.cloudinary.com/hq02xjols/image/upload/v1627310498/code-of-conducts/Code_of_Conduct_FINAL.docx.pdf',
                      );
                    }
                  }}>
                  code of conduct
                </Text>{' '}
                of this company
              </Text>
            </ScrollView>
          </ViewFlex>
        </>
      );
    };

    return (
      <I18n>
        {(t) => (
          <Container>
            {isLoading ? <Loading /> : renderInvite(t, invite)}
          </Container>
        )}
      </I18n>
    );
  }

  showOpenDirection = () => {
    try {
      if (this.state.invite.shift.venue.title) return true;
    } catch (err) {
      return false;
    }

    return false;
  };

  showMarker = () => {
    try {
      if (
        this.state.invite.shift.venue.longitude &&
        this.state.invite.shift.venue.latitude
      ) {
        return true;
      }
    } catch (err) {
      return false;
    }

    return false;
  };

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  };

  openMapsApp = () => {
    let latitude;
    let longitude;

    try {
      latitude = this.state.invite.shift.venue.latitude || DEFAULT_LATITUDE;
      longitude = this.state.invite.shift.venue.longitude || DEFAULT_LONGITUDE;
    } catch (e) {
      latitude = DEFAULT_LATITUDE;
      longitude = DEFAULT_LONGITUDE;
    }

    openMapsApp(latitude, longitude);
  };

  getInvite = () => {
    if (this.state.inviteId === 'NO_ID') {
      return this.props.navigation.goBack();
    }
    inviteActions.getInvite(this.state.inviteId);
  };

  applyJob = () => {
    let jobTitle;

    try {
      jobTitle = this.state.invite.shift.venue.title;
    } catch (e) {
      return;
    }

    if (!jobTitle) return;

    if (
      this.state.invite &&
      this.state.invite.employee.employment_verification_status ===
        'NOT_APPROVED' &&
      this.state.invite.employee.user.date_joined
    ) {
      if (
        moment(this.state.invite.employee.user.date_joined, 'YYYYMMDD').isAfter(
          moment('20210925'),
        )
      ) {
        return Alert.alert(
          'Employment Verification Requiered',
          'Please, submit both your W-4 and I-9 Employment Verification. Once approved you will be able to accepet shift invites in JobCore Talent. ', // <- this part is optional, you can pass an empty string
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false },
        );
      }
    }

    Alert.alert(
      i18next.t('JOB_INVITES.applyJob'),
      jobTitle,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel applyJob');
          },
        },
        {
          text: i18next.t('JOB_INVITES.apply'),
          onPress: () => {
            LOG(this, 'ACCEPT applyJob');
            this.setState({ isLoading: true }, () => {
              inviteActions.applyJob(this.state.invite.id);
            });
            this.isLoading(true);
          },
        },
      ],
      { cancelable: false },
    );
  };

  rejectJob = () => {
    let jobTitle;

    try {
      jobTitle = this.state.invite.shift.venue.title;
    } catch (e) {
      return;
    }

    if (!jobTitle) return;

    Alert.alert(
      i18next.t('JOB_INVITES.rejectJob'),
      jobTitle,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel rejectJob');
          },
        },
        {
          text: i18next.t('JOB_INVITES.reject'),
          onPress: () => {
            this.isLoading(true);
            inviteActions.rejectJob(this.state.invite.id);
          },
        },
      ],
      { cancelable: false },
    );
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

export default InviteDetailsV2;
