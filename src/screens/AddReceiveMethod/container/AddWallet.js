import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import NTextInput from '~/components/ui/TextInput';
import theme from '~/components/theme/Style';
import * as api from '~/services/axios/Api';
import {showLoader, hideLoader} from '~/store/actions/LoaderAction';
import {
  checkEmptyState,
  checkUserInputs,
  checkErrorMessage,
} from '~/utils/validationHandler';
import {validate} from '~/utils';

import FooterButton from '~/components/ui/FooterButton';

WalletBlock.defaultProps = {};

WalletBlock.propTypes = {
  onPressContinue: PropTypes.func.isRequired,
};

function checkEmpty(value) {
  return value !== '' ? true : false;
}

export default function WalletBlock({
  beneficiaryId,
  onPressContinue,
  onPressBack,
  identificationNumber,
  walletError,
}) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    identificationValue: identificationNumber,
  });
  const [validator, setValidator] = React.useState({
    identificationValueValidate: walletError,
  });
  const [errorMessage, setErrorMessage] = useState({
    identificationValueErrorMessage:
      'Wallet with the provided details was not found. Please confirm and re-enter the wallet details.',
  });
  const [initialError, setInitialError] = useState(walletError);

  // validation
  React.useEffect(() => {
    if (initialError) {
      setInitialError(false);
    } else {
      setErrorMessage({});
      const {identificationValue} = state;
      const identificationValueValidate =
        checkEmpty(identificationValue) &&
        !validate.walletIdentificationValue(identificationValue);
      setValidator(prevState => ({
        ...prevState,
        identificationValueValidate,
      }));
    }
  }, [state]);

  const setError = () => {
    setErrorMessage(prevState => ({
      ...prevState,
      identificationValueErrorMessage: 'Not Found',
    }));
    setValidator(prevState => ({
      ...prevState,
      identificationValueValidate: true,
    }));
  };

  const onAddWallet = () => {
    const userInput = {
      identificationValue: state.identificationValue,
    };
    const isValidate = checkUserInputs(userInput, validator);

    if (isValidate) {
      dispatch(showLoader());
      const body = {
        identificationValue: state.identificationValue,
      };
      api
        .createBeneficiaryWallet(beneficiaryId, body)
        .then(res => {
          if (res.status === 200) {
            dispatch(hideLoader());
            setState({});
            onPressContinue(res.data);
          } else {
            dispatch(hideLoader());
            setError();
          }
        })
        .catch(err => {
          console.log('let me print err message', err);
          setError();
          dispatch(hideLoader());
        });
    } else {
      const validateData = checkEmptyState(userInput);
      setValidator(prevState => ({
        ...prevState,
        ...validateData,
      }));
      const errMsg = checkErrorMessage({
        ...state,
      });
      setErrorMessage(prevState => ({
        ...prevState,
        ...errMsg,
      }));
      dispatch(hideLoader());
    }
  };

  return (
    <View style={styles.container}>
      <NTextInput
        label="Identification Number"
        inputParentStyles={styles.inputParentStyle}
        value={state.identificationValue}
        keyboardType="numeric"
        hasError={validator.identificationValueValidate}
        errorMessage={errorMessage.identificationValueErrorMessage}
        onChangeText={value => {
          value = value.slice(0, 9);
          setState(prevState => ({
            ...prevState,
            identificationValue: value,
          }));
        }}
      />
      <FooterButton
        onPressBack={onPressBack}
        text="Continue"
        onPress={onAddWallet}
        style={styles.continueBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  inputParentStyle: {
    marginBottom: 15,
  },
  headerText: {
    color: theme.primaryColor,
    fontWeight: '500',
    marginBottom: 20,
  },
  btnStyle: {},
  continueBtn: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 18,
  },
});
