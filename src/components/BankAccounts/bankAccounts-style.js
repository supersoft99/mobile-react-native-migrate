import {
  StyleSheet,
  // Platform,
  Dimensions,
} from 'react-native';
import { BLUE_MAIN, BLUE_DARK, WHITE_MAIN } from '../../shared/colorPalette';

const { height } = Dimensions.get('window');

export const bankAccountsStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 35,
    marginBottom: 40,
    marginTop: 40,
  },
  noDocsText: {
    fontSize: 16,
    height: 50,
    fontWeight: '800',
    textAlign: 'center',
    color: BLUE_DARK,
    marginTop: height / 3,
  },
  viewButtomLogin: {
    backgroundColor: BLUE_DARK,
    borderRadius: 0,
    height: 45,
    marginBottom: 0,
    marginTop: 40,
    justifyContent: 'center',
  },
  viewInput: {
    backgroundColor: 'transparent',
    borderColor: BLUE_MAIN,
    borderRadius: 0,
    borderWidth: 1,
    color: BLUE_DARK,
    height: '100%',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 0,
    width: '100%',
    justifyContent: 'space-between',
  },
  textButtom: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: WHITE_MAIN,
  },
  garbageIcon: {
    width: 20,
    height: 24,
    marginLeft: 10,
    color: 'black',
  },
  formStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  statusStyle: {
    fontWeight: '600',
    color: BLUE_DARK,
  },
});
