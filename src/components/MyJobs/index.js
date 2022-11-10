import React, { Component } from 'react';
import { View, Image, RefreshControl } from 'react-native';

import {
  Container,
  Content,
  Button,
  Text,
  Left,
  Body,
  Right,
  Segment,
  ListItem,
  Icon,
} from 'native-base';
import styles from './style';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import * as jobActions from './actions';
import { equalMonthAndYear } from '../../shared';
import { CustomToast, Loading, CenteredText } from '../../shared/components';
import jobStore from './JobStore';
import moment from 'moment';
import { TabHeader } from '../../shared/components/TabHeader';
import { log } from 'pure-logger';
import UpcomingJobScreen from './UpcomingJobScreen';
import ApplicationDetailScreen from './ApplicationDetailScreen';
import textStyles from '../../shared/textStyles';
import JobCompletedScreen from './JobCompletedScreen';
import WorkModeScreen from './WorkModeScreen';

const jobFilters = [
  {
    name: 'upcoming',
    action: 'getUpcomingJobs',
    style: 'pointUpcoming',
  },
  {
    name: 'pending', // must match the i18n translate
    action: 'getPendingJobs', // Must match the action's name
    style: 'pointPending', // must match the style's name
  },
  {
    name: 'completed',
    action: 'getCompletedJobs',
    style: 'pointCompleted',
  },
  {
    name: 'failed',
    action: 'getFailedJobs',
    style: 'pointPending',
  },
];

class MyJobs extends Component {
  static navigationOptions = {
    tabBarLabel: i18next.t('MY_JOBS.myJobs'),
    tabBarIcon: ({ tintColor }) => (
      <Icon
        type="MaterialCommunityIcons"
        style={{ color: tintColor }}
        name="briefcase"
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingJobs: false,
      isRefreshing: false,
      showNoJobsText: false,
      jobs: [],
      jobFilterSelected: props.navigation.getParam(
        'tabAction',
        'getUpcomingJobs',
      ),
    };
  }

  componentDidMount() {
    this.getPendingJobsSubscription = jobStore.subscribe(
      'GetPendingJobs',
      (data) => {
        this.getJobsHandler(data, 'getPendingJobs');
      },
    );

    this.getUpcomingJobsSubscription = jobStore.subscribe(
      'GetUpcomingJobs',
      (data) => {
        this.getJobsHandler(data, 'getUpcomingJobs');
      },
    );

    this.getCompletedJobsSubscription = jobStore.subscribe(
      'GetCompletedJobs',
      (data) => {
        this.getJobsHandler(data, 'getCompletedJobs');
      },
    );

    this.getFailedJobsSubscription = jobStore.subscribe(
      'GetFailedJobs',
      (data) => {
        this.getJobsHandler(data, 'getFailedJobs');
      },
    );

    this.jobStoreError = jobStore.subscribe('JobStoreError', (err) => {
      this.errorHandler(err);
    });

    this.isLoading(true);
    this.getJobs();
  }

  componentWillUnmount() {
    this.getPendingJobsSubscription.unsubscribe();
    this.getUpcomingJobsSubscription.unsubscribe();
    this.getCompletedJobsSubscription.unsubscribe();
    this.getFailedJobsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  /**
   * [getJobsHandler description]
   * @param  {Array} jobs              the job list
   * @param  {String} jobFilterSelected the job filter action
   * to set the active tab
   */
  getJobsHandler = (jobs, jobFilterSelected) => {
    log(`getJobsHandler`, jobs, jobFilterSelected);
    const showNoJobsText = Array.isArray(jobs) && !jobs.length ? true : false;

    this.setState({
      jobs,
      showNoJobsText,
      jobFilterSelected,
      isRefreshing: false,
      isLoadingJobs: false,
      isLoading: false,
    });
  };

  errorHandler = (err) => {
    this.setState({
      isRefreshing: false,
      isLoadingJobs: false,
      isLoading: false,
    });
    CustomToast(err, 'danger');
  };

  render() {
    const { jobs } = this.state;
    console.log('jobsss ', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            {this.state.isLoading ? <Loading /> : null}
            {this.state.showNoJobsText ? (
              <CenteredText text={`${t('MY_JOBS.noJobs')}`} />
            ) : null}
            <TabHeader screenName="my_jobs" title={t('MY_JOBS.myJobs')} />
            <Segment style={styles.viewSegment}>
              {jobFilters.map((filter, index) => (
                <Button
                  key={filter.name}
                  onPress={() => this.selectJobFilter(filter.action)}
                  style={[
                    styles[
                      this.state.jobFilterSelected === filter.action
                        ? 'buttonActive'
                        : 'buttonInactive'
                    ],
                    index === 0 ? styles.firstButtonBorderLeft : {},
                  ]}>
                  <View style={styles[filter.style]} />
                  <View
                    style={[
                      styles[
                        this.state.jobFilterSelected === filter.action
                          ? styles[filter.style]
                          : 'inactiveFilter'
                      ],
                      index === 0 ? styles.firstButtonBorderLeft : {},
                    ]}
                  />
                </Button>
              ))}
            </Segment>
            <View style={styles.viewTitle}>
              {jobFilters.map((filter) => (
                <View key={filter.name} style={styles.viewItem}>
                  <Text style={styles.titleItem}>
                    {t(`MY_JOBS.${filter.name}`)}
                  </Text>
                </View>
              ))}
            </View>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.refreshJobs}
                />
              }>
              {this.state.jobs.map((job, index, array) => {
                const showDate =
                  index === 0 ||
                  !equalMonthAndYear(
                    array[index].starting_at,
                    array[index - 1].starting_at,
                  );

                return (
                  <View key={index}>
                    {showDate ? (
                      <Text style={styles.titleDate}>
                        {moment(job.starting_at)
                          .tz(moment.tz.guess())
                          .format('MMM YYYY')}
                      </Text>
                    ) : null}

                    <ListItem
                      onPress={() => this.goToJobDetails(job)}
                      icon
                      style={styles.viewList}>
                      <Left>
                        <View>
                          <Text style={{ width: 60 }}>
                            {moment(job.starting_at)
                              .tz(moment.tz.guess())
                              .format('ddd D')}
                          </Text>
                        </View>
                      </Left>
                      <Body>
                        <Text
                          style={textStyles.textShiftTitle}
                          numberOfLines={1}>
                          {job.position.title}
                        </Text>
                      </Body>
                      <Right style={[styles.noRight]}>
                        <View>
                          <Text style={[textStyles.textBlack, { width: 75 }]}>
                            {moment(job.starting_at)
                              .tz(moment.tz.guess())
                              .format('h:mm a')}
                          </Text>
                        </View>
                      </Right>
                    </ListItem>
                  </View>
                );
              })}
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  refreshJobs = () => {
    this.setState({ isRefreshing: true });
    this.getJobs();
  };

  /**
   * Set the jobFilterSelected and call the action to load the jobs
   * @param  {string} jobFilterSelected the filter action to execute
   * and to set the active tab
   */
  selectJobFilter = (jobFilterSelected) => {
    if (this.state.isLoadingJobs) return;

    this.setState({ jobFilterSelected, isLoading: true }, this.getJobs);
  };

  /**
   * get the jobs with the corrent selected filter/action
   */
  getJobs() {
    if (typeof jobActions[this.state.jobFilterSelected] !== 'function') return;

    jobActions[this.state.jobFilterSelected]();
  }

  goToJobDetails = (job) => {
    if (!job) return;
    if (
      !(
        job.applicationId === null ||
        job.applicationId === undefined ||
        job.applicationId === ''
      )
    ) {
      return this.props.navigation.navigate(ApplicationDetailScreen.routeName, {
        applicationId: job.applicationId,
      });
    }
    const now = moment();
    const clockOutDelta = job.maximum_clockout_delay_minutes || 120;
    const trueEndingAt = moment
      .utc(job.ending_at)
      .add(clockOutDelta, 'minutes');

    if (now.isAfter(trueEndingAt)) {
      return this.props.navigation.navigate(JobCompletedScreen.routeName, {
        shiftId: job.id,
      });
    }

    if (now.isAfter(moment.utc(job.starting_at))) {
      return this.props.navigation.navigate(WorkModeScreen.routeName, {
        shiftId: job.id,
      });
    }

    this.props.navigation.navigate(UpcomingJobScreen.routeName, {
      shiftId: job.id,
    });
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

export default MyJobs;
