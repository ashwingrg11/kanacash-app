import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import theme from '~/components/theme/Style';
import FooterButton from '~/components/ui/FooterButton';
import {RegularText} from '~/components/ui/Text';
import OtpInputs from '~/components/ui/OtpInputs';
import GenericView from '~/components/ui/GenericView';
import AuthHeader from '~/components/ui/AuthHeader';
import {setError} from '~/store/actions/Error';
import {
  resendDeviceVerificationCodeApi,
  verifyDeviceVerificationApi,
} from '../../store/actions/DeviceVerificationAction';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';

export default function EmailVerificationCode({navigation}) {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const [resendMessage, setResendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getOtp = otpValue => {
    setOtp(otpValue);
  };

  const onPressContinue = () => {
    setErrorMessage('');
    setResendMessage('');
    if (otp.length === 6) {
      const body = {
        device: otp,
      };
      dispatch(verifyDeviceVerificationApi(body));
    } else {
      let message =
        Platform.OS === 'ios'
          ? 'Please fill out this field.'
          : 'Verification code does not match.';
      let modalConfig = {
        message: message,
        message_title: '',
      };
      setErrorMessage(message);
      dispatch(setError(modalConfig));
    }
  };

  const onResendVerificationCode = () => {
    setResendMessage('');
    dispatch(resendDeviceVerificationCodeApi('resend')).then(response => {
      if (response.status === 200) {
        setResendMessage('Successfully Sent the code');
      } else {
        setResendMessage(
          response.data?.message
            ? response.data.message
            : 'Failed to Sent the code',
        );
      }
    });
  };

  return (
    <GenericView padding>
      <KeyboardAwareView>
        <ScrollView behavior={'padding'} keyboardShouldPersistTaps="handled">
          <AuthHeader
            title={'Enter \nThe Access Code'}
            intro={
              'please enter the six-digit access code we \nsent to your email address'
            }
          />
          <View style={styles.formWrapper}>
            <OtpInputs
              inputWrapper={{width: 50}}
              inputCode={6}
              getOtp={otpValue => getOtp(otpValue)}
              containerStyle={styles.otpInputStyle}
              hasError={errorMessage}
            />

            {resendMessage !== '' ? (
              <RegularText text={resendMessage} />
            ) : (
              <></>
            )}

            <FooterButton
              text="Verify & Continue"
              style={styles.continueBtn}
              onPress={onPressContinue}
            />
            <View style={styles.flexRow}>
              <RegularText
                text={"Didn't get the code? "}
                style={[styles.introText]}
              />
              <RegularText
                text={'Resend'}
                style={[styles.resendText]}
                onPress={onResendVerificationCode}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareView>
    </GenericView>
  );
}

const styles = StyleSheet.create({
  continueBtn: {
    marginTop: 5,
    marginBottom: 8,
    fontSize: 18,
  },
  flexRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    marginTop: 7,
  },
  resendText: {
    color: theme.red,
  },
  otpInputStyle: {
    marginBottom: 20,
  },
  errorMsg: {marginTop: 5, color: theme.red},
});
