import React from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import NTextInput from '~/components/ui/TextInput';

export default function OtpInputsAndroid({getOtp, containerStyle, hasError}) {
  const otpInput = React.useRef(null);
  const [otp, setOtp] = React.useState('');

  React.useEffect(() => {
    otpInput.current.focus();
  }, []);

  React.useEffect(() => {
    getOtp(otp);
  }, [getOtp, otp]);

  return (
    <View style={[styles.container, containerStyle && containerStyle]}>
      <NTextInput
        onChangeText={otpValue => {
          otpValue = otpValue.slice(0, 6);
          setOtp(otpValue);
        }}
        value={otp}
        keyboardType={'number-pad'}
        onSubmitEditing={() => Keyboard.dismiss()}
        inputRef={otpInput}
        hasError={hasError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
