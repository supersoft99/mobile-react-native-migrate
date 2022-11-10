import { StyleSheet, Platform } from 'react-native';
import {
  WHITE_MAIN,
  GRAY_MAIN,
  RED_MAIN,
  BLACK_MAIN,
  BG_GRAY_LIGHT,
} from '../../shared/colorPalette';

const inviteStyles = StyleSheet.create({
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginBottom: 20,
    height: 280,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  viewShift: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingTop: 0,
  },
  textAlreadyRated: {
    marginTop: 10,
    color: 'black',
    textAlign: 'center',
  },
  textLocation: {
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCustom: {
    backgroundColor: 'black',
  },
  titleHeader: {
    color: '#fff',
    fontWeight: '500',
  },
  buttomApply: {
    backgroundColor: 'black',
  },
  buttomReject: {
    backgroundColor: 'black',
  },
  viewListItem: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  viewDataOffers: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  textOne: {
    color: 'black',
    fontSize: 12,
    textAlign: 'left',
  },
  textTwo: {
    color: GRAY_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textThree: {
    color: 'black',
    fontSize: 12,
    textAlign: 'left',
  },
  textRed: {
    color: RED_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textBlack: {
    color: BLACK_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  viewTitleInfo: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  viewCrud: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  viewButtomLeft: {
    width: '50%',
    marginRight: 5,
  },
  viewButtomClock: {
    width: '50%',
    marginRight: 5,
    marginTop: 25,
  },
  buttomLeft: {
    borderColor: 'black',
    // backgroundColor: 'black',
    borderWidth: 1,
    height: 38,
  },
  buttomBlueDark: {
    borderColor: 'transparent',
    backgroundColor: 'black',
    height: 38,
  },
  buttomBottom: {
    borderColor: 'transparent',
    backgroundColor: 'black',
    height: 38,
    // width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
  },
  clockInButton: {
    borderColor: 'transparent',
    backgroundColor: 'black',
    height: 38,
    // width: '70%',
    textAlign: 'center',
    alignItems: 'center',
  },
  clockOutButton: {
    borderColor: 'transparent',
    backgroundColor: 'black',
    height: 38,
    // width: '70%',
    textAlign: 'center',
    alignItems: 'center',
  },
  clockInButtonDisabled: {
    borderColor: 'transparent',
    backgroundColor: GRAY_MAIN,
    height: 38,
    // width: '70%',
    textAlign: 'center',
  },
  viewButtomRight: {
    width: '50%',
    marginLeft: 5,
  },
  buttomRight: {
    borderColor: 'transparent',
    backgroundColor: 'black',
    height: 38,
  },
  textViolet: {
    color: 'black',
  },
  textBlue: {
    color: 'black',
  },
  textWhite: {
    color: WHITE_MAIN,
    textAlign: 'center',
  },
  textBlack: {
    color: 'black',
    textAlign: 'center',
  },
  textDark: {
    color: 'black',
  },
  openDirectionButton: {
    borderColor: 'black',
    marginTop: 10,
    alignSelf: 'center',
  },

  // Css New design
  bgInfo: {
    backgroundColor: BG_GRAY_LIGHT,
    minHeight: 175,
    height: '100%',
    padding: 5,
  },
  imgCover: {
    width: 60,
    height: 60,
  },
  bodyItemText: {
    marginTop: 10,
  },
  viewInfoDate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    ...Platform.select({
      android: {
        marginTop: 0,
      },
      ios: {
        marginTop: 5,
      },
    }),
  },
  viewContent: {
    width: '50%',
  },
  textTitle: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
  },
  textSubTitle: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '100',
    ...Platform.select({
      android: {
        fontSize: 14,
      },
      ios: {
        fontSize: 16,
      },
    }),
  },
  textCenter: {
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  viewDir: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 0,
    marginTop: 5,
  },
  viewAmount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  viewTime: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    margin: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
  },
  viewCheck: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
  },
  clockIns: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
  },
  viewBottom: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
    paddingLeft: 60,
    paddingRight: 60,
  },
});

export { inviteStyles };
