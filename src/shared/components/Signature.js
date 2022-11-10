// Capture Digital Signature in React Native App for Android and iOS
// https://aboutreact.com/react-native-capture-signature/

// import React in our code
import React, { createRef } from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import SignatureCapture from 'react-native-signature-capture';

const Signature = (props) => {
  const sign = createRef();

  const saveSign = () => {
    sign.current.saveImage();
  };

  const resetSign = () => {
    sign.current.resetImage();
  };

  const _onSaveEvent = (result) => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    alert('Signature Saved');
    if (props.onSave) {
      props.onSave(result.encoded);
    }
  };

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SignatureCapture
          style={styles.signature}
          ref={sign}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          showNativeButtons={false}
          showTitleLabel={false}
          saveImageFileInExtStorage={false}
          viewMode={'portrait'}
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              saveSign();
            }}>
            <Text>Save</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              resetSign();
            }}>
            <Text>Reset</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Signature;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    height: 250,
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  signature: {
    flex: 1,
    borderColor: '#000000',
    // backgroundColor: 'gray',
    color: '#000000',
    borderWidth: 4,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    // backgroundColor: '#eeeeee',
    margin: 10,
  },
});
