import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import styles from './styles';

class FormViewPreferences extends Component {
  static navigationOptions = { header: null };

  render() {
    return (
      <ScrollView
        style={styles.viewFormPreferences}
        keyboardShouldPersistTaps={'always'}>
        {this.props.children}
      </ScrollView>
    );
  }
}

export default FormViewPreferences;
