import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Platform} from 'react-native';
import {
  useDispatch,
  //  useSelector
} from 'react-redux';
import theme from '~/components/theme/Style';
import FooterButton from '~/components/ui/FooterButton';
import {RegularText} from '~/components/ui/Text';
import OtpInputs from '~/components/ui/OtpInputs';
import AuthHeader from '~/components/ui/AuthHeader';
import GenericView from '~/components/ui/GenericView';
import {
  NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN,
  // NAVIGATION_TO_PHONE_VERIFIED_SCREEN,
  // NAVIGATION_TO_USER_VERIFIED_SCREEN,
} from '../../navigation/routes';
import * as api from '~/services/axios/Api';
import {showLoader, hideLoader} from '~/store/actions/LoaderAction';
import {resendVerificationCodeApi} from '~/store/actions/SignupAction';
import {setError} from '~/store/actions/Error';
// import {setToken} from '~/store/actions/AuthAction';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';

export default function PhoneVerification({navigation}) {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const getOtp = otpValue => {
    setOtp(otpValue);
  };

  const onPressContinue = () => {
    setErrorMessage('');
    setResendMessage('');
    if (otp.length === 6) {
      dispatch(showLoader());
      setErrorMessage('');
      api
        .verification('phone', otp)
        .then(response => {
          dispatch(hideLoader());
          console.log('response', response);
          if (response.status === 200) {
            // isAuthenticated
            //   ? navigation.navigate(NAVIGATION_TO_PHONE_VERIFIED_SCREEN)
            //   : navigation.navigate(NAVIGATION_TO_USER_VERIFIED_SCREEN);
            navigation.navigate(NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN);
          } else {
            let modalConfig = {
              message: response.data.message ? response.data.message : 'Sorry',
              message_title: '',
            };
            dispatch(setError(modalConfig));
            setErrorMessage(response.data.message);
          }
        })
        .catch(err => {
          dispatch(hideLoader());
          let modalConfig = {
            message: err.data.message,
            message_title: '',
          };
          dispatch(setError(modalConfig));
          setErrorMessage(err.data.message);
        });
    } else {
      let message =
        Platform.OS === 'ios'
          ? 'Please fill out this field.'
          : 'Verification code does not match.';
      let modalConfig = {
        message: message,
        message_title: '',
      };
      dispatch(setError(modalConfig));
      setErrorMessage(message);
    }
  };

  const onResendVerificationCode = () => {
    setErrorMessage('');
    setResendMessage('');
    dispatch(resendVerificationCodeApi('phone')).then(response => {
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
              'Please enter the Six-digit access code we \nsent to your phone number.'
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
            {errorMessage !== '' ? (
              <RegularText text={errorMessage} style={styles.errorMsg} />
            ) : (
              <></>
            )}

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
                text={"Didn't get the code?"}
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
