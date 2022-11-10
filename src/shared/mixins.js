import { Alert } from 'react-native';
import { i18next } from '../i18n';
import * as jobActions from '../components/MyJobs/actions';
import moment from 'moment';
import { CustomToast } from './components';

export function clockInMixin() {
  console.log(`${this.constructor.name}:clockInMixin:this:`);
  if (!this.state.shiftId) return;

  let jobTitle;
  try {
    jobTitle = this.state.shift.venue.title;
  } catch (e) {
    CustomToast('The venue has no title!');
    return;
  }

  if (!jobTitle) return;

  Alert.alert(i18next.t('MY_JOBS.wantToClockIn'), jobTitle, [
    { text: i18next.t('APP.cancel') },
    {
      text: i18next.t('MY_JOBS.clockIn'),
      onPress: () => {
        console.log(`${this.constructor.name}:clockInMixin:onPress:`);
        jobActions.clockIn(
          this.state.shift.id,
          this.latitude,
          this.longitude,
          moment.utc(),
        );
      },
    },
  ]);
}

export const _round = (x) => {
  return Number.parseFloat(x).toFixed(8);
};

export function clockOutMixin() {
  console.log(`${this.constructor.name}:clockOutMixin:this:`);
  if (!this.state.shiftId) return;

  let jobTitle;
  try {
    jobTitle = this.state.shift.venue.title;
  } catch (e) {
    return;
  }

  if (!jobTitle) return;

  Alert.alert(i18next.t('MY_JOBS.wantToClockOut'), jobTitle, [
    { text: i18next.t('APP.cancel') },
    {
      text: i18next.t('MY_JOBS.clockOut'),
      onPress: () => {
        console.log(`${this.constructor.name}:clockOutMixin:onPress`);
        jobActions.clockOut(
          this.state.shift.id,
          this.latitude,
          this.longitude,
          moment.utc(),
        );
      },
    },
  ]);
}
