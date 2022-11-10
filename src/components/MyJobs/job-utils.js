import moment from 'moment';

export const canClockIn = (shift) => {
  // No shift information yet
  if (!shift) return false;

  const endingAtMoment = moment(shift.ending_at);
  // const startingAtMoment = moment(shift.starting_at);
  const nowMoment = moment.utc();

  // If the shift already ended
  if (nowMoment.isSameOrAfter(endingAtMoment)) return false;

  const diffInMinutesToStartShift = getDiffInMinutesToStartShift(shift);

  const maxClockInDelta =
    shift.maximum_clockin_delta_minutes !== null
      ? shift.maximum_clockin_delta_minutes
      : 99999;

  // If the shift hasn't started and there is still not the time to clock in
  if (!shift.clockin_set.length && diffInMinutesToStartShift >= maxClockInDelta)
    return false;

  // If the shift already started, and there is a Pending Clock In
  if (shift.clockin_set.length > 0)
    if (!shift.clockin_set[shift.clockin_set.length - 1].ended_at) return false;

  return true;
};

export const canClockOut = (shift) => {
  if (!shift) return false;

  const clockinSet = shift.clockin_set;
  if (clockinSet.length === 0) return false;

  clockinSet.sort((a, b) => moment(a.started_at).diff(moment(b.started_at)));

  const startedAt = clockinSet[clockinSet.length - 1].started_at;
  const endedAt = clockinSet[clockinSet.length - 1].ended_at;

  if (startedAt && !endedAt) return true;

  return false;
};

export const getDiffInMinutesToStartShift = (shift) => {
  if (!shift) throw new Error('No shift specified');
  const startingAtMoment = moment(shift.starting_at);
  const nowMoment = moment.utc();
  return startingAtMoment.diff(nowMoment, 'minutes');
};

export const getRatingEmployeeFormat = (rating) => {
  rating = parseFloat(rating);

  return rating && typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
};
