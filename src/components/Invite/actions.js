import * as Flux from '../../shared/flux-state';
import {
  editPositionsValidator,
  editAvailabilityDatesValidator,
  editAvailabilityAlldayValidator,
} from './validators';
import { putData, getData, deleteData, postData } from '../../fetch';
// import moment from 'moment';
// import getMomentNowDiff from '../../shared/getMomentNowDiff';

/**
 * Action for listing the job invites
 */
const getJobInvites = () => {
  getData('/employees/me/shifts/invites?status=PENDING')
    .then((jobInvites) => {
      Flux.dispatchEvent('JobInvites', jobInvites);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Invite details action
 * @param  {string || number} inviteId the invite id
 */
const getInvite = (inviteId) => {
  getData(`/employees/me/shifts/invites/${inviteId}`)
    .then((jobInvites) => {
      Flux.dispatchEvent('GetInvite', jobInvites);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Action to apply a job invite
 * @param  {string || number} inviteId the invite id
 */
const applyJob = (inviteId) => {
  putData(`/employees/me/shifts/invites/${inviteId}/APPLY`)
    .then((data) => {
      Flux.dispatchEvent('ApplyJob', data);
    })
    .catch((err) => {
      console.log('Invite:actions:applyJob', err);
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 *  Action to reject a job invite
 * @param  {string || number} inviteId the invite id
 */
const rejectJob = (inviteId) => {
  putData(`/employees/me/shifts/invites/${inviteId}/REJECT`)
    .then((data) => {
      Flux.dispatchEvent('RejectJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * List positions action
 */
const getPositions = () => {
  return getData('/positions')
    .then((positions) => {
      Flux.dispatchEvent('GetPositions', positions);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Get Job Preferences action
 */
const getJobPreferences = () => {
  return getData('/employees/me')
    .then((jobPreferences) => {
      Flux.dispatchEvent('GetJobPreferences', jobPreferences);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

export const fetchNarrowPreferences = async () => {
  let data = null;
  try {
    data = await getData('/catalog/narrow-preferences');
  } catch (err) {
    Flux.dispatchEvent('InviteStoreError', err);
    throw err;
  }
  Flux.dispatchEvent('NarrowPreferences', data);
  return data;
};

/**
 * Edit positions action
 * @param  {Array} positions    positions ids list
 */
const editPositions = (positions) => {
  try {
    editPositionsValidator(positions);
  } catch (err) {
    return Flux.dispatchEvent('InviteStoreError', err);
  }

  putData(`/employees/me`, {
    positions: positions,
  })
    .then((data) => {
      Flux.dispatchEvent('EditPositions', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Edit jobs preferences action
 * @param  {number} minimumHourlyRate   hourly rate number
 * @param  {number} maximumJobDistanceMiles maximum distance off jobs
 */
const editJobPreferences = (minimumHourlyRate, maximumJobDistanceMiles) => {
  putData(`/employees/me`, {
    minimum_hourly_rate: minimumHourlyRate,
    maximum_job_distance_miles: maximumJobDistanceMiles,
  })
    .then((data) => {
      Flux.dispatchEvent('EditJobPreferences', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Edit stopReceivingInvites field on employees
 * @param  {boolean} stopReceivingInvites   if stop receiving invites
 */
const stopReceivingInvites = (stopReceivingInvites) => {
  putData(`/employees/me`, {
    stop_receiving_invites: stopReceivingInvites,
  })
    .then((data) => {
      Flux.dispatchEvent('StopReceivingInvites', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * List availability action
 */
const getAvailability = () => {
  getData('/employees/me/availability')
    .then((availability) => {
      Flux.dispatchEvent('GetAvailability', availability);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Add availability allday action
 * @param {boolean} allday  if available all day
 * @param {string || number} availabilityId  the block id
 */
const editAvailabilityAllday = (allday, availabilityId) => {
  try {
    editAvailabilityAlldayValidator(allday, availabilityId);
  } catch (err) {
    return Flux.dispatchEvent('InviteStoreError', err);
  }

  putData(`/employees/me/availability/${availabilityId}`, {
    allday: allday,
  })
    .then((data) => {
      Flux.dispatchEvent('EditAvailability', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

export const editAvailability = (availability) => {
  putData(`/employees/me/availability/${availability.id}`, {
    ...availability,
  })
    .then((data) => {
      Flux.dispatchEvent('EditAvailability', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

export const regenerateAvailability = (availability) => {
  postData(`/employees/me/availability`, {
    ...availability,
  })
    .then(() => {
      Flux.dispatchEvent('RegenerateAvailability');
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

export const deleteAvailability = (availability) => {
  deleteData(`/employees/me/availability/${availability.id}`)
    .then(() => {
      Flux.dispatchEvent('DeleteAvailability');
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Add availability dates action
 * @param {date} startingAt start date
 * @param {date} endingAt   end date
 * @param {string || number} availabilityId  the block id
 */
const editAvailabilityDates = (startingAt, endingAt, availability) => {
  try {
    editAvailabilityDatesValidator(startingAt, endingAt, availability.id);
  } catch (err) {
    return Flux.dispatchEvent('InviteStoreError', err);
  }

  putData(`/employees/me/availability/${availability.id}`, {
    recurrency_type: availability.recurrency_type,
    starting_at: startingAt,
    ending_at: endingAt,
  })
    .then((data) => {
      Flux.dispatchEvent('EditAvailability', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * Save Location action
 * @param  {object} location
 * @param  {object} location.location
 * @param  {object} location.street_address
 * @param  {object} location.city
 * @param  {object} location.state
 * @param  {object} location.country
 * @param  {object} location.zipCode
 * @param  {object} location.latitude
 * @param  {object} location.longitude
 */
const saveLocation = (location) => {
  putData(`/profiles/me`, location)
    .then((data) => {
      Flux.dispatchEvent('SaveLocation', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

/**
 * get profile action, to get user's location and public profile
 */
const getProfile = () => {
  return getData(`/profiles/me`)
    .then((data) => {
      Flux.dispatchEvent('GetProfile', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('InviteStoreError', err);
    });
};

export const postI9Form = (data) => {
  postData(`/employees/me/i9-form`, data)
    .then((data) => {
      Flux.dispatchEvent('I9Form', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('I9FormError', err);
    });
};
export const putI9Form = (data) => {
  putData(`/employees/me/i9-form`, data)
    .then((data) => {
      Flux.dispatchEvent('I9Form', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('I9FormError', err);
    });
};

export const postW4Form = (data) => {
  postData(`/employees/me/w4-form`, data)
    .then((data) => {
      Flux.dispatchEvent('W4Form', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('W4FormError', err);
    });
};
export const putW4Form = (data) => {
  putData(`/employees/me/w4-form`, data)
    .then((data) => {
      Flux.dispatchEvent('W4Form', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('W4FormError', err);
    });
};

export {
  getJobInvites,
  getInvite,
  applyJob,
  rejectJob,
  getPositions,
  getJobPreferences,
  editJobPreferences,
  editPositions,
  getAvailability,
  editAvailabilityAllday,
  editAvailabilityDates,
  stopReceivingInvites,
  saveLocation,
  getProfile,
};
