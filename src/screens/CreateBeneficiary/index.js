import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Keyboard,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import FooterButton from '~/components/ui/FooterButton';
import NTextInput from '~/components/ui/TextInput';
import {SemiBoldText, RegularText} from '~/components/ui/Text';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';
import * as api from '~/services/axios/Api';
import {setError} from '~/store/actions/Error';
import ExpandableBlock from '~/components/ui/ExpandableBlock';
import checkAvailablePayoutMethod from '~/utils/checkAvailablePayoutMethod';

import {
  // NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN,
  NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN,
  NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN,
  NAVIGATION_TO_PAYOUT_METHOD_SCREEN,
} from '../../navigation/routes';
import {validate} from '~/utils';
import {
  checkEmptyState,
  checkUserInputs,
  checkErrorMessage,
} from '~/utils/validationHandler';
import PickerModal from '~/components/ui/PickerModal';
import receiveMethod, {
  CASH_PICKUP,
  HOME_DELIVERY,
  WALLET,
} from '~/constants/receiveMethod';
import {Outline, Done} from '~/components/ui/Icon';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {showLoader, hideLoader} from '~/store/actions/LoaderAction';
import {showToast} from '~/store/actions/ToastAction';
import KenyaCounties from './KenyaCounties';
import LiberiaCounties from './LiberiaCounties';

function checkEmpty(value) {
  return value !== '' ? true : false;
}

const resetBeneficiaryObj = {
  firstName: '',
  middleName: '',
  lastName: '',
  phoneNumber: '',
  city: '',
  state: '',
};

const beneficiaryObj = {
  firstName: '',
  middleName: '',
  lastName: '',
  country: '',
  city: '',
  state: '',
  phoneNumber: '',
};

export default function AddCard({navigation, route}) {
  const mNameInput = useRef(null);
  const lNameInput = useRef(null);
  // const cityInput = useRef(null);
  const phoneInput = useRef(null);

  const dispatch = useDispatch();

  const isUpdate = route.params?.update ? true : false;
  const isCountrySelected = route.params?.routeFrom ? true : false;
  const [receiverMethodSelected, setReceiverMethodSelected] = useState(
    isUpdate,
  );
  const transactionDetails = useSelector(state => state.transaction);

  const [pickerCountries, setPickerCountries] = useState([]);
  const [payoutMethod, setPayoutMethod] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [beneficiary, setBeneficiary] = useState(beneficiaryObj);
  const [state, setState] = useState([]);
  const [countries, setCountries] = useState([]);
  const [validator, setValidator] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [selectedCountry, setSelectedCountry] = useState({});
  const isHomeDeliverySelected = selectedBlock === HOME_DELIVERY;
  const [town, setTown] = useState([]);

  const [counties, setCounties] = useState([]);

  React.useEffect(() => {
    if (selectedCountry.name === 'Liberia') {
      setCounties(LiberiaCounties);
    } else if (selectedCountry.name === 'Kenya') {
      setCounties(KenyaCounties);
    }
  }, [selectedCountry.name]);

  // validation
  React.useEffect(() => {
    const {
      firstName,
      middleName,
      lastName,
      country,
      city,
      // eslint-disable-next-line no-shadow
      state,
      phoneNumber,
    } = beneficiary;
    setErrorMessage({});
    const firstNameValidate =
      checkEmpty(firstName) && !validate.text(firstName);
    const middleNameValidate =
      checkEmpty(middleName) && !validate.text(middleName);
    const lastNameValidate = checkEmpty(lastName) && !validate.text(lastName);
    const countryValidate = checkEmpty(country) && !validate.text(country);
    const cityValidate = checkEmpty(city) && !validate.specialText(city);
    const stateValidate = checkEmpty(state) && state?.length < 2;
    const beneficiaryPhoneNumberValidate =
      checkEmpty(phoneNumber) && !validate.beneficiaryPhoneNumber(phoneNumber);

    setValidator(prevState => ({
      ...prevState,
      firstNameValidate,
      middleNameValidate,
      lastNameValidate,
      countryValidate,
      cityValidate,
      stateValidate,
      beneficiaryPhoneNumberValidate,
    }));
  }, [beneficiary]);

  const selectCountryForBeneficiary = countryValue => {
    const filterCountry = countries.find(item => item.name === countryValue);
    setPickerCountries([filterCountry]);
    setPayoutMethod(filterCountry);
  };

  React.useEffect(() => {
    if (isCountrySelected) {
      setPickerCountries([{...transactionDetails.destination}]);
      setPayoutMethod(transactionDetails.destination);
    }
  }, [isCountrySelected, transactionDetails.destination]);

  React.useEffect(() => {
    setLoading(true);
    const getDestinationCountries = api.getDestinationCountries('USA');
    const unsubscribe = Promise.all([getDestinationCountries])
      .then(values => {
        setCountries(values[0].data.result);
        setLoading(false);
      })
      .then(error => setLoading(false));
    return () => unsubscribe;
  }, []);

  /**
   * if update
   */
  React.useEffect(() => {
    if (countries.length > 0 && isUpdate) {
      const {
        address: {
          addressLine1,
          addressLine2,
          city,
          country,
          // postalCode,
          state,
        },
        firstName,
        lastName,
        middleName,
        phoneNumber,
      } = route.params.update;
      setBeneficiary({
        addressLine1,
        addressLine2,
        city,
        country,
        // postalCode,
        state,
        firstName,
        lastName,
        middleName,
        phoneNumber: phoneNumber.replace(`+${selectedCountry.phoneCode}`, ''),
      });
      const filterCountry = countries.find(
        item => item.threeCharCode === country,
      );
      setPickerCountries([filterCountry]);
      setSelectedCountry(filterCountry);
      if (counties.length > 0) {
        onChangeCounties(state);
        onChangeCity(city);
      }
    }
  }, [
    isUpdate,
    route.params.update,
    countries,
    counties,
    selectedCountry.phoneCode,
    onChangeCounties,
  ]);

  React.useEffect(() => {
    if (isHomeDeliverySelected) {
      setBeneficiary(prevState => ({
        ...prevState,
        city: 'Yerevan',
      }));
      if (state.length > 0) {
        const selectedState = state.find(item => item.name === 'Yerevan');
        setBeneficiary(prevState => ({
          ...prevState,
          state: selectedState.code,
        }));
      }
    }
  }, [isHomeDeliverySelected, state]);

  const updateBeneficiary = body => {
    api
      .updateBeneficiary(body, route.params.update.referenceId)
      .then(res => {
        setLoading(false);
        if (res.status === 200) {
          dispatch(
            showToast({
              message: 'Beneficiary successfully updated',
            }),
          );
          navigation.goBack();
        } else {
          const msg = JSON.parse(res.data.message);
          let modalConfig = {
            message: msg?.message,
            message_title: '',
          };
          dispatch(setError(modalConfig));
        }
      })
      .catch(err => {
        setLoading(false);
        let message = 'Error while updating receiver';
        try {
          message = err?.data?.message
            ? JSON.parse(err.data.message)?.message
            : 'Error while updating receiver';
        } catch (error) {
          message = err.data.message;
        }
        Alert.alert(message);
      });
  };

  const resetBeneficiaryDetails = () => {
    setBeneficiary(prevState => ({...prevState, ...resetBeneficiaryObj}));
    setReceiverMethodSelected(undefined);
    setSelectedBlock(undefined);
  };

  const stopLoading = () => {
    dispatch(hideLoader());
    setLoading(false);
  };

  const checkBlockCondition = (
    routeFrom,
    selectedBlockValue,
    beneficiaryValue,
  ) => {
    if (selectedBlockValue !== WALLET) {
      stopLoading();
      navigation.navigate(NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN, {
        routeFrom: routeFrom,
        selectedBlock: selectedBlockValue,
        beneficary: beneficiaryValue,
      });
      dispatch(showToast({message: 'Successfully added beneficiary'}));
      resetBeneficiaryDetails();
    } else {
      api
        .createBeneficiaryWallet(beneficiaryValue.referenceId, {
          identificationValue: beneficiary.phoneNumber,
        })
        .then(res => {
          stopLoading();
          resetBeneficiaryDetails();
          if (res.status === 200) {
            var message =
              'Beneficiary and mobile Wallet has been successfully added';
            dispatch(showToast({message: message, status: true}));
            const transactionDetail = {
              recipientId: beneficiaryValue.referenceId,
              recipientBankId: res.data.referenceId,
              payoutMethod: selectedBlockValue,
              beneficiary: beneficiaryValue,
              BeneficiaryBank: res.data,
              payerId: '',
              payer: '',
            };
            if (routeFrom) {
              dispatch(createTransactionData(transactionDetail));
              navigation.navigate(NAVIGATION_TO_PAYOUT_METHOD_SCREEN, {
                routeFrom: routeFrom,
              });
            } else {
              navigation.goBack();
            }
          } else {
            dispatch(
              showToast({
                message: 'Successfully added beneficiary',
              }),
            );
            navigation.navigate(NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN, {
              selectedBlock: selectedBlockValue,
              beneficary: {
                ...beneficiaryValue,
                identificationNumber: beneficiary.phoneNumber,
              },
              error: true,
            });
          }
        })
        .catch(() => {
          resetBeneficiaryDetails();
          stopLoading();
          dispatch(
            showToast({
              message: 'Successfully added beneficiary',
            }),
          );
          navigation.navigate(NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN, {
            routeFrom: routeFrom,
            selectedBlock: selectedBlockValue,
            beneficary: {
              ...beneficiaryValue,
              identificationNumber: beneficiary.phoneNumber,
            },
            error: true,
          });
        });
    }
  };

  const createBeneficiary = body => {
    dispatch(showLoader());
    api
      .createBeneficiary(body)
      .then(res => {
        if (res.status === 200) {
          if (route?.params?.routeFrom === 'AddBeneficiaryDetails') {
            // routeFrom is used here to control the navigation flow
            const routeFrom = 'AddBeneficiaryDetails';
            checkBlockCondition(routeFrom, selectedBlock, res.data);
          } else {
            if (
              selectedBlock === HOME_DELIVERY ||
              selectedBlock === CASH_PICKUP
            ) {
              stopLoading();
              navigation.navigate(NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN);
            } else {
              checkBlockCondition('', selectedBlock, res.data);
            }
          }
        } else {
          stopLoading();
          const msg = JSON.parse(res.data.message);
          let modalConfig = {
            message: msg.errors ? msg.errors[0].message : '',
            message_title: msg?.message,
          };
          dispatch(setError(modalConfig));
        }
      })
      .catch(err => {
        stopLoading();
        let message = 'Error while Adding beneficiary';
        try {
          message = err?.data?.message
            ? JSON.parse(err.data.message)?.message
            : 'Error while Adding beneficiary';
        } catch (error) {
          message = err.data.message;
        }
        let modalConfig = {
          message: message,
          message_title: 'Error',
        };
        dispatch(setError(modalConfig));
      });
  };

  const onPressSubmit = () => {
    // resetBeneficiaryDetails();
    Keyboard.dismiss();
    setLoading(true);
    const userInput = {
      firstName: beneficiary.firstName,
      lastName: beneficiary.lastName,
      country: beneficiary.country,
      city: beneficiary.city,
      state: beneficiary.state,
      beneficiaryPhoneNumber: beneficiary.phoneNumber,
    };
    const isValidate = checkUserInputs(userInput, validator);
    if (isValidate) {
      const filterBeneficiary = {
        ...beneficiary,
        firstName: beneficiary.firstName.trim(),
        middleName: beneficiary.middleName.trim(),
        lastName: beneficiary.lastName.trim(),
        country: beneficiary.country.trim(),
        city: beneficiary.city.trim(),
        state: beneficiary.state.trim(),
        phoneNumber: beneficiary.phoneNumber,
      };
      const body = {
        ...filterBeneficiary,
      };
      if (isUpdate) {
        updateBeneficiary(body);
      } else {
        createBeneficiary(body);
      }
    } else {
      setLoading(false);
      const validateData = checkEmptyState(userInput);
      setValidator(prevState => ({
        ...prevState,
        ...validateData,
      }));
      const errMsg = checkErrorMessage({
        ...beneficiary,
        beneficiaryPhoneNumber: beneficiary.phoneNumber,
      });
      setErrorMessage(prevState => ({
        ...prevState,
        ...errMsg,
      }));
    }
  };

  const onSelectCountry = countryValue => {
    const filterPickedCountry = pickerCountries.find(
      item => item.threeCharCode === countryValue,
    );
    setBeneficiary(prevState => ({
      ...prevState,
      country: filterPickedCountry.threeCharCode,
    }));
    setSelectedCountry(filterPickedCountry);
    api.getState(filterPickedCountry.threeCharCode).then(res => {
      try {
        setState(res.data.result);
      } catch (error) {}
    });
  };

  const renderNewReceiverMethod = ({item}) => {
    const title =
      payoutMethod.name === 'Kenya' ? 'M-Pesa Wallet' : 'MTN Wallet';
    return checkAvailablePayoutMethod(payoutMethod.payoutMethod, item.value) ? (
      <ExpandableBlock
        onPress={() => setSelectedBlock(item.payoutMethod)}
        containerStyle={styles.blockContainer}
        leftContent={item.icon}
        title={item.payoutMethod === 'WALLET' ? title : item.title}
        caption={item.caption}
        rightContent={
          selectedBlock === item.payoutMethod ? <Done size={30} /> : <Outline />
        }
      />
    ) : null;
  };

  const onChangeCounties = stateValue => {
    const filterSelectedCounties = counties.find(
      item => item.name === stateValue,
    );
    setTown(filterSelectedCounties.town);
    setBeneficiary(prevState => ({
      ...prevState,
      state: stateValue,
      city: '',
    }));
  };

  const onChangeCity = cityValue => {
    setBeneficiary(prevState => ({
      ...prevState,
      city: cityValue,
    }));
  };

  return (
    <GenericView
      padding
      header={
        <Header
          title={
            route.params?.update
              ? 'Update Beneficiary'
              : 'Add a New Beneficiary'
          }
        />
      }>
      {!receiverMethodSelected ? (
        <FlatList
          ListHeaderComponent={
            <React.Fragment>
              <SemiBoldText
                text="Beneficiary details"
                style={[styles.headerText]}
              />
              {!isCountrySelected && (
                <PickerModal
                  // default={false}
                  label="Please select country"
                  onValueChange={selectCountryForBeneficiary}
                  pickerValue={'name'}
                  pickOptions={countries}
                  placeholder="Select"
                  inputParentStyles={styles.inputParentStyleMarginBottom}
                />
              )}

              <RegularText
                text="Please Select receive Method"
                style={[styles.headerText]}
              />
            </React.Fragment>
          }
          extraData={pickerCountries}
          data={payoutMethod === undefined ? [] : receiveMethod}
          renderItem={renderNewReceiverMethod}
          keyExtractor={item => item.title}
          ListFooterComponent={
            <FooterButton
              disabled={!selectedBlock}
              text="Continue"
              onPress={() => setReceiverMethodSelected(true)}
            />
          }
          contentContainerStyle={styles.contentContainerStyle}
          ListFooterComponentStyle={styles.listFooterComponentStyle}
        />
      ) : (
        <KeyboardAwareView contentContainerStyle={styles.full}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainerStyle}>
            <SemiBoldText
              text="Beneficiary details"
              style={[styles.headerText]}
            />
            {isHomeDeliverySelected ? (
              <View style={styles.homeDeliveryWrapper}>
                <Icon name="md-warning" size={20} style={styles.iconStyle} />
                <RegularText text="Home delivery is only available in Yerevan" />
              </View>
            ) : (
              <></>
            )}
            <NTextInput
              label="First Name"
              inputParentStyles={styles.inputParentStyleMarginBottom}
              onChangeText={firstName =>
                setBeneficiary(prevState => ({
                  ...prevState,
                  firstName: firstName,
                }))
              }
              value={beneficiary.firstName}
              hasError={validator.firstNameValidate}
              errorMessage={errorMessage.firstNameErrorMessage}
              onSubmitEditing={() => mNameInput.current.focus()}
            />

            <NTextInput
              label="Middle Name (Optional)"
              errorMessage={errorMessage.middleNameErrorMessage}
              hasError={validator.middleNameValidate}
              inputParentStyles={styles.inputParentStyleMarginBottom}
              onChangeText={middleName =>
                setBeneficiary(prevState => ({
                  ...prevState,
                  middleName: middleName,
                }))
              }
              value={beneficiary.middleName}
              inputRef={mNameInput}
              onSubmitEditing={() => lNameInput.current.focus()}
            />
            <NTextInput
              label="Last Name"
              inputParentStyles={styles.inputParentStyleMarginBottom}
              onChangeText={lastName =>
                setBeneficiary(prevState => ({
                  ...prevState,
                  lastName: lastName,
                }))
              }
              value={beneficiary.lastName}
              hasError={validator.lastNameValidate}
              errorMessage={errorMessage.lastNameErrorMessage}
              inputRef={lNameInput}
              // onSubmitEditing={() => addressInput.current.focus()}
            />

            <PickerModal
              default={true}
              hasError={validator?.countryValidate}
              errorMessage={'This field cannot be empty'}
              label="Country"
              pickerValue={'threeCharCode'}
              placeholder="Select"
              onValueChange={onSelectCountry}
              selectedValue={beneficiary.country}
              pickOptions={pickerCountries}
              inputParentStyles={styles.inputParentStyleMarginBottom}
            />

            <PickerModal
              default={false}
              hasError={validator?.stateValidate}
              label="Counties"
              onValueChange={onChangeCounties}
              selectedValue={beneficiary.state}
              errorMessage={'This field cannot be empty'}
              pickerValue={'name'}
              pickOptions={counties}
              placeholder="Select"
              inputParentStyles={styles.inputParentStyleMarginBottom}
            />

            <PickerModal
              default={false}
              onPressEmptyPicker={() =>
                Alert.alert('Please select counties first')
              }
              containerStyle={styles.textInputWrapper(isHomeDeliverySelected)}
              disabled={isHomeDeliverySelected}
              selectedValue={beneficiary.city}
              hasError={validator?.cityValidate}
              errorMessage={errorMessage.cityErrorMessage}
              label="Town"
              onValueChange={onChangeCity}
              pickerValue={'name'}
              pickOptions={town}
              placeholder="Select"
              inputParentStyles={styles.inputParentStyleMarginBottom}
            />

            <RegularText
              text={'Contact details of Beneficiary'}
              style={styles.labelStyle}
            />
            <View style={styles.phoneNumberWrapper}>
              <NTextInput
                editable={false}
                placeholder={`+${selectedCountry.phoneCode}`}
                inputParentStyles={[
                  styles.phoneCode,
                  styles.inputParentStyleMarginBottom,
                ]}
                keyboardType="phone-pad"
              />
              <NTextInput
                placeholder={'Enter phone number'}
                inputParentStyles={[
                  styles.phoneNumberInput,
                  styles.inputParentStyleMarginBottom,
                ]}
                onChangeText={phoneNumber => {
                  phoneNumber = phoneNumber.slice(0, 9);
                  setBeneficiary(prevState => ({
                    ...prevState,
                    phoneNumber,
                  }));
                }}
                keyboardType="phone-pad"
                value={beneficiary.phoneNumber}
                hasError={validator?.beneficiaryPhoneNumberValidate}
                errorMessage={errorMessage.beneficiaryPhoneNumberErrorMessage}
                inputRef={phoneInput}
                returnKeyType={'go'}
                onSubmitEditing={onPressSubmit}
              />
            </View>
            <FooterButton
              onPressBack={() => {
                if (isUpdate) {
                  navigation.goBack();
                } else {
                  setReceiverMethodSelected(undefined);
                  setSelectedBlock(undefined);
                  setBeneficiary(beneficiaryObj);
                }
              }}
              disabled={loading}
              text={isUpdate && loading ? 'Updating...' : 'Continue'}
              onPress={onPressSubmit}
              style={styles.continueBtn}
            />
          </ScrollView>
        </KeyboardAwareView>
      )}
    </GenericView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    marginBottom: 10,
  },
  labelStyle: {
    marginBottom: 10,
  },
  continueBtn: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 18,
  },
  inputParentStyleMarginBottom: {
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  phoneCode: {
    width: '25%',
    marginRight: '2%',
  },
  phoneNumberInput: {
    width: '73%', // + (25+2) from phone code - 100
  },
  blockContainer: {
    marginVertical: 10,
  },
  listFooterComponentStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainerStyle: {
    minHeight: '100%',
    paddingBottom: 70,
  },
  homeDeliveryWrapper: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFF99',
    marginBottom: 10,
    alignItems: 'center',
  },
  iconStyle: {
    color: '#999900',
    marginRight: 10,
  },
  textInputWrapper: isHomeDelivery => ({
    backgroundColor: isHomeDelivery ? '#d5d5d5' : '#fff',
  }),
  phoneNumberWrapper: {flexDirection: 'row', justifyContent: 'center'},
});
