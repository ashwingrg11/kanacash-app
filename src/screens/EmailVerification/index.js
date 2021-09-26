import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import FooterButton from '~/components/ui/FooterButton';
import NTextInput from '~/components/ui/TextInput';
import GenericView from '~/components/ui/GenericView';
import AuthHeader from '~/components/ui/AuthHeader';
import {NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN} from '../../navigation/routes';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';

export default function EmailVerification({navigation}) {
  const email = useSelector(state => state.signup.email);
  const signup = useSelector(state => state.signup);

  return (
    <GenericView padding>
      <KeyboardAwareView>
        <ScrollView behavior={'padding'}>
          <AuthHeader
            title={'Verify \nYour Email'}
            intro={
              'Please enter your valid email address \nhere and we will send you an auth code'
            }
          />
          <View>
            <NTextInput
              editable={false}
              label={'Email Address'}
              inputParentStyles={styles.inputParentStyleMarginBottom}
              value={email}
              blurOnSubmit={true}
            />
            <FooterButton
              text="Send Authorization Code"
              style={styles.continueBtn}
              onPress={() =>
                navigation.navigate(
                  NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN,
                )
              }
            />
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
  inputParentStyleMarginBottom: {
    marginBottom: 20,
  },
});
