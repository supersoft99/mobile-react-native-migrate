import { StyleSheet, Platform, Dimensions } from 'react-native';
var width = Dimensions.get('window').width;
import { BLUE_MAIN, BLUE_DARK, WHITE_MAIN } from '../../shared/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE_MAIN,
  },
  containerChange: {
    paddingHorizontal: 35,
  },
  viewLogo: {
    width: '80%',
    height: 90,
    ...Platform.select({
      android: {
        marginTop: '20%',
      },
    }),
  },
  viewBackground: {
    backgroundColor: WHITE_MAIN,
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  viewForm: {
    width: width,
    paddingLeft: 35,
    paddingRight: 35,
    marginTop: '20%',
    marginBottom: 20,
  },
  viewButtomLogin: {
    marginTop: 30,
    marginBottom: 0,
    borderRadius: 0,
    height: 55,
    backgroundColor: 'black',
  },
  viewButtomSignUp: {
    marginTop: 30,
    borderRadius: 0,
    marginBottom: 0,
    height: 55,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 3,
    color: 'black',
  },
  viewButtomSignUpNoBorder: {
    marginTop: 30,
    borderRadius: 0,
    marginBottom: 0,
    height: 55,
    backgroundColor: 'transparent',
    // borderStyle: 'solid',
    // borderColor: 'black',
    // borderWidth: 3,
    color: 'black',
  },
  textButtom: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  textButtomSignUp: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
  },
  textButtomForgot: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5,
    color: 'black',
  },
  viewInput: {
    backgroundColor: 'transparent',
    height: 55,
    width: '100%',
    borderColor: 'black',
    color: 'black',
    borderRadius: 0,
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 0,
    paddingRight: 10,
    marginBottom: 10,
    marginLeft: 0,
  },
  borderNone: {
    borderBottomColor: 'transparent',
  },
  labelForm: {
    color: 'black',
  },
  fillOutEmailText: {
    textAlign: 'center',
    color: 'black',
    marginVertical: 50,
  },
});
