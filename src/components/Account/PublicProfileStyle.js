import { StyleSheet } from 'react-native';
import {
  BLUE_MAIN,
  BLUE_DARK,
  WHITE_MAIN,
  BLUE_LIGHT,
  BG_GRAY_LIGHT,
} from '../../shared/colorPalette';

export default StyleSheet.create({
  headerCustom: {
    backgroundColor: BLUE_MAIN,
  },
  titleHeader: {
    color: WHITE_MAIN,
    fontWeight: '500',
    fontSize: 18,
  },
  viewHeader: {
    backgroundColor: BLUE_LIGHT,
    borderRadius: 0,
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textHeader: {
    color: BLUE_DARK,
    fontSize: 14,
    textAlign: 'center',
  },
  viewProfileImg: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 15,
    width: 80,
  },
  viewProfileImgOnboarding: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15,
    // paddingLeft: 15,
    width: 160,
  },
  viewProfileResumeOnboarding: {
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 15,
    width: '100%',
  },
  profileImg: {
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  camera: {
    resizeMode: 'contain',
    height: 26,
    width: 26,
  },
  viewCameraCircle: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 93, 102, 0.8)',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  viewCameraCircleOnboarding: {
    height: 64,
    width: 64,
    borderRadius: 64 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 93, 102, 0.8)',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  textName: {
    textAlign: 'center',
    fontWeight: '700',
    color: BLUE_DARK,
    marginBottom: 10,
  },
  textBio: {
    textAlign: 'center',
    color: BLUE_DARK,
    marginTop: 10,
    marginBottom: 30,
  },
  textRowTitle: {
    textAlign: 'center',
    color: BLUE_DARK,
    fontWeight: '700',
    margin: 0,
  },
  textRowNumber: {
    fontSize: 16,
    textAlign: 'center',
    color: BLUE_DARK,
    paddingRight: 30,
    paddingLeft: 30,
    fontWeight: 'normal',
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  viewLeft: {
    width: '50%',
  },
  viewRight: {
    width: '50%',
  },
  viewPadding: {
    paddingHorizontal: 15,
  },
  textSubtitle: {
    fontWeight: '700',
    color: BLUE_DARK,
    marginBottom: 10,
  },
  badgesList: {
    marginBottom: 30,
  },
  viewBadgeListItem: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageBadge: {
    alignSelf: 'center',
  },
  textBadgeName: {
    fontSize: 14,
    textAlign: 'center',
    color: BLUE_DARK,
    width: 70,
  },
  textReview: {
    color: BLUE_DARK,
    paddingBottom: 5,
  },
  textInfo: {
    textAlign: 'center',
    color: BLUE_DARK,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 35,
    paddingLeft: 35,
  },
  titleProfile: {
    fontWeight: '700',
    color: BLUE_DARK,
  },
  textProfile: {
    color: BLUE_DARK,
    fontWeight: 'normal',
  },
  viewInfo: {
    paddingLeft: 35,
    paddingRight: 35,
    marginBottom: 30,
  },
  viewProgress: {
    marginRight: 35,
    marginLeft: 35,
  },
  barProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#c5d4d6',
  },
  barProgressCompleted: (completed) => ({
    position: 'absolute',
    width: `${completed}%`,
    height: 4,
    backgroundColor: BLUE_DARK,
  }),
  textProgress: {
    textAlign: 'center',
    margin: 10,
    color: BLUE_DARK,
  },
  barProgressCircle: (completed) => ({
    width: 17.5,
    height: 17.5,
    backgroundColor: completed ? BLUE_DARK : '#c5d4d6',
    borderRadius: 70,
    position: 'absolute',
    right: -1,
    top: -6.5,
    borderColor: completed ? BLUE_DARK : BG_GRAY_LIGHT,
    borderWidth: 1.5,
  }),
});
