import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  WebView,
  Alert,
  Image,
  Switch,
  Platform,
  Linking,
  NavState,
} from 'react-native';
import {
  Item,
  Input,
  Button,
  Text,
  Form,
  Label,
  Content,
  Thumbnail,
  Textarea,
  Container,
  Picker,
  Icon,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import editProfileStyles from './EditProfileStyle';
import profileStyles from './PublicProfileStyle';
import UploadDocumentScreen from './UploadDocumentScreen';
import * as actions from './actions';
import accountStore from './AccountStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import { LOG, WARN } from '../../shared';
import TouchID from 'react-native-touch-id';
import { CustomToast, Loading } from '../../shared/components';
import ImagePicker from 'react-native-image-picker';
import { RESET_ROUTE, JOB_PREFERENCES_ROUTE } from '../../constants/routes';
import PROFILE_IMG from '../../assets/image/profile.png';
import { GRAY_MAIN, BG_GRAY_LIGHT, BLUE_DARK } from '../../shared/colorPalette';
import { TabHeader } from '../../shared/components/TabHeader';
import moment from 'moment';

const icon = require('../../assets/image/tab/profile.png');

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  noData: true,
  skipBackup: true,
};

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  color: '#e00606', // Android,
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false,
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
};

class EditProfile extends Component {
  static navigationOptions = {
    tabBarLabel: i18next.t('PROFILE.profile'),
    tabBarIcon: () => (
      <Image
        style={{ resizeMode: 'contain', width: 42, height: 42 }}
        source={icon}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      docType: 22,
      showDatePicker: false,
      firstName: '',
      lastName: '',
      email: '',
      picture: '',
      resume: '',
      bio: '',
      profile_city: '',
      cities: [],
      city: 'others',
      profile_city_id: '',
      last_4dig_ssn: '',
      userBirthDate: null,
      _userBirthDate: null,
      loginAutoSave: false,
      biometrySupport: true,
      selectedImage: {},
      selectedResume: {},
    };

    this.setPermissionTouchId();
  }

  async componentDidMount() {
    TouchID.isSupported(optionalConfigObject)
      .then((biometryType) => {
        // Success code
        // console.log('biometryyyyy .', biometryType);
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
        }
      })
      .catch((error) => {
        this.setState({
          biometrySupport: false,
        });
        console.log('errr catch support ', error);
      });
    // const loginAuto = await AsyncStorage.getItem('@JobCoreCredential');
    this.getCitiesSubscription = accountStore.subscribe('GetCities', (cities) =>
      this.setState({ cities }),
    );
    this.editProfileSubscription = accountStore.subscribe(
      'EditProfile',
      this.editProfileHandler,
    );
    this.getUserSubscription = accountStore.subscribe('getUser', (user) => {
      this.setUserInfo(user);
    });
    this.editProfilePictureSubscription = accountStore.subscribe(
      'EditProfilePicture',
      this.editProfilePictureHandler,
    );
    this.editProfileResumeSubscription = accountStore.subscribe(
      'EditProfileResume',
      this.editProfileResumeHandler,
    );
    this.accountStoreError = accountStore.subscribe(
      'AccountStoreError',
      this.errorHandler,
    );
    actions.getCities();
    actions.getUser();
  }

  setPermissionTouchId = async () => {
    const permissionTouchId = await AsyncStorage.getItem(
      '@JobCoreCredentialPermission',
    );
    if (permissionTouchId) {
      this.setState({
        loginAutoSave: true,
      });
    } else {
      this.setState({
        loginAutoSave: false,
      });
    }
  };
  openResumePicker = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      this.handleResumePickerResponse,
    );
  };
  componentWillUnmount() {
    this.getUserSubscription.unsubscribe();
    this.getCitiesSubscription.unsubscribe();
    this.editProfileSubscription.unsubscribe();
    this.editProfilePictureSubscription.unsubscribe();
    this.editProfileResumeSubscription.unsubscribe();
    this.accountStoreError.unsubscribe();
  }

  changeTouchId = async () => {
    const { loginAutoSave } = this.state;
    if (!loginAutoSave) {
      //hacer async y guardar en storage el permiso a usar touch id
      await AsyncStorage.setItem(
        '@JobCoreCredentialPermission',
        JSON.stringify({ success: true }),
      );
      this.setState({
        loginAutoSave: !loginAutoSave,
      });
    } else {
      await AsyncStorage.removeItem('@JobCoreCredentialPermission');
      await AsyncStorage.removeItem('@JobCoreCredential');
      // hacer false el permiso del storage,
      // y tambien de una vaciar el storage de la credenciales
      this.setState({
        loginAutoSave: !loginAutoSave,
      });
    }
  };

  saveDocumentAlert = (docName, res) => {
    Alert.alert(
      'Are you sure to upload resume:',
      ` ${docName}?`,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel add document');
          },
        },
        {
          text: 'Upload',
          onPress: () => actions.uploadDocument(res),
        },
      ],
      { cancelable: false },
    );
  };

  editProfilePictureHandler = (data) => {
    this.setUser(data);
    this.editProfile();
  };
  editProfileResumeHandler = (data) => {
    // this.setUser(data);
    // this.editProfile();
    console.log('resume', data);
  };

  editProfileHandler = (data) => {
    this.isLoading(false);
    CustomToast(i18next.t('EDIT_PROFILE.profileUpdated'));
    this.setUser(data);
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.onboarding
    ) {
      this.props.navigation.navigate(UploadDocumentScreen.routeName);
      CustomToast('Profile Saved. Please upload your documents to continue.');
    } else {
      this.props.navigation.goBack();
    }
  };

  handleClickResume = (resume) => {
    Linking.canOpenURL(resume).then((supported) => {
      if (supported) {
        Linking.openURL(resume);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  };
  errorHandler = (err) => {
    this.isLoading(false);
    CustomToast(err, 'danger');
  };

  handleNavigationStateChange = (event: NavState) => {
    if (event.url) {
      this.webview.stopLoading();
      Linking.openURL(event.url);
    }
  };

  render() {
    const {
      loginAutoSave,
      biometrySupport,
      profile_city,
      cities,
      city,
      profile_city_id,
      _userBirthDate,
      showDatePicker,
      isLoading,
    } = this.state;

    console.log('edit profile', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            {isLoading ? <Loading /> : null}
            <TabHeader
              goBack
              onPressBack={() => this.props.navigation.goBack()}
              title={t('EDIT_PROFILE.editProfile')}
            />
            <Content>
              <View style={editProfileStyles.container}>
                <TouchableOpacity onPress={this.openImagePicker}>
                  <View style={profileStyles.viewProfileImg}>
                    <Thumbnail
                      large
                      source={
                        this.state.selectedImage && this.state.selectedImage.uri
                          ? { uri: this.state.selectedImage.uri }
                          : this.state.picture
                            ? { uri: this.state.picture }
                            : PROFILE_IMG
                      }
                    />
                    <View style={profileStyles.viewCameraCircle}>
                      <Image
                        style={profileStyles.camera}
                        source={require('../../assets/image/camera.png')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <View>
                  <Form>
                    <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.firstName')}</Label>
                      <Input
                        value={this.state.firstName}
                        placeholder={t('REGISTER.firstName')}
                        onChangeText={(text) =>
                          this.setState({ firstName: text })
                        }
                      />
                    </Item>
                    <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.lastName')}</Label>
                      <Input
                        value={this.state.lastName}
                        placeholder={t('REGISTER.lastName')}
                        onChangeText={(text) =>
                          this.setState({ lastName: text })
                        }
                      />
                    </Item>
                    <Item
                      style={[
                        editProfileStyles.viewInput,
                        {
                          borderColor: GRAY_MAIN,
                          backgroundColor: BG_GRAY_LIGHT,
                        },
                      ]}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.email')}</Label>
                      <Input
                        editable={false}
                        value={this.state.email}
                        placeholder={t('REGISTER.email')}
                      />
                    </Item>
                    <Item style={editProfileStyles.itemTextBio}>
                      <Text style={editProfileStyles.textBio}>
                        {t('EDIT_PROFILE.textBio')}
                      </Text>
                    </Item>
                    <Item
                      onPress={this.focusTextarea}
                      style={editProfileStyles.viewTextArea}
                      rounded>
                      <Textarea
                        ref={(textarea) => (this.textarea = textarea)}
                        rowSpan={5}
                        value={this.state.bio}
                        placeholder={t('REGISTER.bio')}
                        onChangeText={(text) => this.setState({ bio: text })}
                      />
                    </Item>

                    <Item
                      onPress={this.focusTextarea}
                      style={{
                        alignContent: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginLeft: 0,
                        marginTop: 5,
                        borderBottomWidth: 0,
                      }}>
                      {this.state.selectedResume &&
                      this.state.selectedResume.uri ? (
                          <Button
                            full
                            onPress={this.openResumePicker}
                            style={editProfileStyles.viewButtonResume}>
                            <Text style={editProfileStyles.textButtom}>
                              {'Edit Resume'}
                            </Text>
                          </Button>
                        ) : this.state.resume ? (
                          <View>
                            <Button
                              full
                              onPress={this.openResumePicker}
                              style={editProfileStyles.viewButtonResume}>
                              <Text style={editProfileStyles.textButtom}>
                                {'Edit Resume'}
                              </Text>
                            </Button>
                          </View>
                        ) : (
                          <Button
                            full
                            onPress={this.openResumePicker}
                            style={editProfileStyles.viewButtonResume}>
                            <Text style={editProfileStyles.textButtom}>
                              {t('EDIT_PROFILE.uploadResume')}
                            </Text>
                          </Button>
                        )}

                      {this.state.resume ? (
                        <Text
                          style={{
                            flex: 1,
                            color: 'blue',
                            textAlign: 'center',
                            display: 'flex',
                            textAlignVertical: 'center',
                            alignContent: 'center',
                          }}
                          onPress={() => Linking.openURL(this.state.resume)}>
                          Preview
                        </Text>
                      ) : null}
                    </Item>

                    {/* <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Icon
                        style={editProfileStyles.pickerIcon}
                        name="arrow-down"
                      />
                      <Label>{t('REGISTER.cityPickerTitle')}</Label>
                      <Picker
                        mode="dropdown"
                        iosHeader={t('REGISTER.city')}
                        placeholder={t('REGISTER.city')}
                        placeholderStyle={{
                          color: '#575757',
                          paddingLeft: 7,
                        }}
                        style={editProfileStyles.picker}
                        selectedValue={
                          profile_city_id && !profile_city
                            ? cities.filter(
                              (city) => city.id === profile_city_id,
                            )[0]
                            : profile_city
                        }
                        onValueChange={(text) => {
                          this.setState({
                            city: text,
                            profile_city: text,
                            wroteCity: '',
                          });
                        }}>
                        {cities.map((city) => (
                          <Picker.Item
                            label={city.name}
                            value={city}
                            key={city.id}
                            // style={editProfileStyles.pickerItem}
                          />
                        ))}
                        <Picker.Item
                          label={t('REGISTER.others')}
                          value="others"
                          key={t('REGISTER.others')}
                          // style={editProfileStyles.pickerItem}
                        />
                      </Picker>
                    </Item> */}
                    {city == 'others' ? (
                      <Item
                        style={editProfileStyles.viewInput}
                        inlineLabel
                        rounded>
                        <Label>{t('REGISTER.wroteCity')}</Label>
                        <Input
                          disabled={city !== 'others'}
                          value={this.state.wroteCity}
                          onChangeText={(text) =>
                            this.setState({ wroteCity: text })
                          }
                        />
                      </Item>
                    ) : null}
                    {/* <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.last_4dig_ssn')}</Label>
                      <Input
                        keyboardType="numeric"
                        value={this.state.last_4dig_ssn}
                        placeholder={t('REGISTER.last_4dig_ssn_placeholder')}
                        onChangeText={(text) => {
                          if (text.length >= 0 && text.length < 5)
                            this.setState({
                              last_4dig_ssn: text.replace(/[^0-9]/g, ''),
                            });
                        }}
                      />
                    </Item> */}
                    <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      onPress={() => {
                        this.setState({ showDatePicker: !showDatePicker });
                      }}
                      rounded>
                      <Label>Birthday</Label>
                      <Input
                        keyboardType="numeric"
                        value={moment(_userBirthDate).format('MM-DD-YYYY')}
                        disabled={true}
                        on
                      />
                    </Item>

                    {(showDatePicker || Platform.OS === 'ios') && (
                      <View>
                        {/* <Text style={preferencesStyles.sliderLabel}> */}
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: '700',
                            marginTop: 5,
                          }}>
                          Enter your date of birth:
                        </Text>
                        <DateTimePicker
                          style={{ height: 75 }}
                          value={_userBirthDate ? _userBirthDate : new Date()}
                          mode={'date'}
                          display="calendar"
                          maximumDate={new Date()}
                          onChange={(_, date) => {
                            this.setState({
                              userBirthDate: moment(date).format('YYYY-MM-DD'),
                              _userBirthDate: date,
                              showDatePicker: false,
                            });
                          }}
                        />
                      </View>
                    )}
                  </Form>
                  <TouchableOpacity
                    onPress={this.passwordReset}
                    style={editProfileStyles.viewButtomChangePassword}>
                    <Text style={editProfileStyles.textButtomChangePassword}>
                      {t('SETTINGS.changePassword')}
                    </Text>
                  </TouchableOpacity>
                  {biometrySupport && (
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginBottom: 20,
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <Text style={editProfileStyles.activateToachIdText}>
                            Activate touch id
                          </Text>
                        </View>
                        <Switch
                          // ios_backgroundColor={BLUE_DARK}
                          thumbColor={BLUE_DARK}
                          onValueChange={() => this.changeTouchId()}
                          value={loginAutoSave}
                        />
                      </View>
                    </View>
                  )}
                  <Button
                    full
                    onPress={this.editProfileAlert}
                    style={editProfileStyles.viewButtomLogin}>
                    <Text style={editProfileStyles.textButtom}>
                      {t('EDIT_PROFILE.saveProfile')}
                    </Text>
                  </Button>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  setUserInfo = (user) => {
    const userBirthDate = moment(user.birth_date);
    this.setState({
      firstName: user.user.first_name,
      lastName: user.user.last_name,
      email: user.user.email,
      picture: user.picture,
      resume: user.resume,
      bio: user.bio,
      profile_city_id: user.profile_city,
      wroteCity: user.city,
      last_4dig_ssn: user.last_4dig_ssn,
      userBirthDate: user.birth_date,
      _userBirthDate: userBirthDate.isValid()
        ? userBirthDate.toDate()
        : new Date(),
      isLoading: false,
    });
    if (user.city) {
      this.setState({
        city: 'others',
        profile_city: 'others',
      });
    }
  };

  setUser = (data) => {
    console.log('setuser', data);
    const session = accountStore.getState('Login');

    try {
      session.user.first_name = data.user.first_name;
      session.user.last_name = data.user.last_name;
      session.user.profile.picture = data.picture;
      session.user.profile.bio = data.bio;
    } catch (e) {
      return WARN(this, `${data} error updating user session`);
    }

    actions.setStoredUser(session);
  };

  editProfileAlert = () => {
    if (
      (this.state.selectedImage && this.state.selectedImage.uri) ||
      !this.state.picture.includes('default')
    ) {
      Alert.alert(
        i18next.t('EDIT_PROFILE.wantToEditProfile'),
        '',
        [
          {
            text: i18next.t('APP.cancel'),
            onPress: () => {
              LOG(this, 'Cancel edit profile');
            },
          },
          {
            text: i18next.t('EDIT_PROFILE.update'),
            onPress: () => {
              this.setState({ isLoading: true }, () => {
                LOG(this, this.state);
                if (this.state.selectedImage && this.state.selectedImage.uri) {
                  return actions.editProfilePicture(this.state.selectedImage);
                }
                this.editProfile();
              });
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      CustomToast('Please upload a profile picture', 'danger');
    }
  };
  editResumeAlert = () => {
    if (
      (this.state.selectedImage && this.state.selectedImage.uri) ||
      !this.state.picture.includes('default')
    ) {
      Alert.alert(
        i18next.t('EDIT_PROFILE.wantToEditProfile'),
        '',
        [
          {
            text: 'Cancel',
            onPress: () => {
              LOG(this, 'Cancel edit resume');
            },
          },
          {
            text: 'Upload',
            onPress: () => {
              this.setState({ isLoading: true }, () => {
                LOG(this, this.state);
                if (
                  this.state.selectedResume &&
                  this.state.selectedResume.uri
                ) {
                  return actions.editProfileResume(this.state.selectedImage);
                }
                this.editProfile();
              });
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      CustomToast('Please upload a profile picture', 'danger');
    }
  };

  editProfile = () => {
    actions.editProfile(
      this.state.firstName,
      this.state.lastName,
      this.state.bio,
      this.state.profile_city,
      this.state.wroteCity,
      this.state.last_4dig_ssn,
      this.state.userBirthDate,
    );
  };

  passwordReset = () => {
    let email;

    try {
      email = this.state.email || '';
    } catch (e) {
      email = '';
    }

    this.props.navigation.navigate(RESET_ROUTE, { email });
  };

  focusTextarea = () => {
    try {
      this.textarea._root.focus();
    } catch (err) {
      WARN(`focusTextarea error: ${err}`);
    }
  };

  openImagePicker = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };

  /**
   * Handle react-native-image-picker response and set the selected image
   * @param  {object} response A react-native-image-picker response
   * with the uri, type & name
   */
  handleImagePickerResponse = (response) => {
    if (response.didCancel) {
      // for react-native-image-picker response
      LOG(this, 'User cancelled image picker');
    } else if (response.error) {
      // for react-native-image-picker response
      LOG(this, `ImagePicker Error: ${response.error}`);
    } else if (response.customButton) {
      // for react-native-image-picker response
      LOG(this, `User tapped custom button: ${response.customButton}`);
    } else {
      if (!response.uri) return;

      let type = response.type;

      if (type === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('.');
        type = response.uri.substring(pos + 1);
        if (type) type = `image/${type}`;
      }
      if (type === undefined) {
        const splitted = response.fileName.split('.');
        type = splitted[splitted.length - 1];
        if (type) type = `image/${type}`;
      }

      let name = response.fileName;
      if (name === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('/');
        name = response.uri.substring(pos + 1);
      }

      const selectedImage = {
        uri: response.uri,
        type: type.toLowerCase(),
        name,
      };

      this.setState({ selectedImage });
    }
  };
  handleResumePickerResponse = (response) => {
    if (response.didCancel) {
      // for react-native-image-picker response
      LOG(this, 'User cancelled image picker');
    } else if (response.error) {
      // for react-native-image-picker response
      LOG(this, `ImagePicker Error: ${response.error}`);
    } else if (response.customButton) {
      // for react-native-image-picker response
      LOG(this, `User tapped custom button: ${response.customButton}`);
    } else {
      if (!response.uri) return;

      let type = response.type;

      if (type === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('.');
        type = response.uri.substring(pos + 1);
        if (type) type = `image/${type}`;
      }
      if (type === undefined) {
        const splitted = response.fileName.split('.');
        type = splitted[splitted.length - 1];
        if (type) type = `image/${type}`;
      }

      let name = response.fileName;
      if (name === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('/');
        name = response.uri.substring(pos + 1);
      }

      const selectedResume = {
        uri: response.uri,
        type: type.toLowerCase(),
        name,
      };
      actions.editProfileResume(selectedResume);
      this.setState({ selectedResume });
    }
  };
  goToJobPreferences = () => {
    this.props.navigation.navigate(JOB_PREFERENCES_ROUTE);
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

EditProfile.routeName = 'EditProfile';

export default EditProfile;
