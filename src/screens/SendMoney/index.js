import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Alert, ScrollView} from 'react-native';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import {RegularText} from '~/components/ui/Text';
import FooterButton from '~/components/ui/FooterButton';
import useFormInput from '~/hooks/useFormInput';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {useDispatch, useSelector} from 'react-redux';
import widgetType from '~/constants/widgetType';
import * as api from '~/services/axios/Api';
import {
  NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN,
  NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN,
  NAVIGTION_TO_WIDGETS_SCREEN,
} from '../../navigation/routes';
import {useFocusEffect} from '@react-navigation/native';
import {getCurrentUser} from '~/store/actions/UserDetailsAction';
import theme from '~/components/theme/Style';
import AmountBlock from '~/components/ui/AmountBlock';
import HorizontalView from '~/components/ui/HorizontalView';
import CountryBlock from '~/components/ui/CountryBlock';
import checkTransactionLimit from './checkTransactionLimit';
import {isLoginFromCalculator} from '~/store/actions/AuthAction';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';
import checkStatus from './checkStatus';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';
import calculateFlatFee from '../../utils/calculateFlatFee';
import STATUS from '~/constants/widgetStatus';
import {showToast} from '~/store/actions/ToastAction';

/**
 * @author sushant suwal
 * @export
 * @param {*} {navigation}
 * @returns
 */
export default function SendMoney({navigation, route}) {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth);
  const transactionDetails = useSelector(state => state.transaction);
  // form
  const senderInput = useFormInput('1'); //send amount
  const recipientInput = useFormInput('0'); //recipient Input

  // APIs data
  const [exchangeRate, setExchangeRate] = useState(undefined);
  const [feeRange, setFeeRange] = useState(undefined);
  const [transactionLimit, setTransactionLimit] = useState(undefined);

  // data for dropdown list
  const [countries, setCountries] = useState({
    destination: [],
    source: [],
  });

  //dropdown selected list
  const [selectedCountry, setSelectedCountry] = useState({
    destination: undefined,
    source: undefined,
  });
  const [onGoBack, setOnGoBack] = useState(false);

  const [currency, setCurrency] = useState({
    destination: [],
    source: [],
  });
  const [selectedCurrency, setSelectedCurrency] = useState({
    destination: undefined,
    source: undefined,
  });

  const [exchangeRateCurrency, setExchangeRateCurrency] = useState({});
  // const [fee, setFee] = useState({});
  const [flatFee, setFlatFee] = useState('0');
  const [transactionFee, setTransactionFee] = useState([]);
  // const [loading, setLoading] = useState(true);

  // check if navigate from review screen
  const review = route?.params?.routeFrom;

  // update content on Review
  React.useEffect(() => {
    const {senderAmount, recipientAmount} = transactionDetails;
    senderInput.setValue(senderAmount ? senderAmount : '1');
    recipientInput.setValue(recipientAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /***
   * update selected country destination
   * form calculator and
   * transaction review
   */
  React.useEffect(() => {
    if (transactionDetails.destinationCountry) {
      const selectedDestinationCountry = countries.destination.find(
        item => item.threeCharCode === transactionDetails.destinationCountry,
      );
      setSelectedCountry(prevState => ({
        ...prevState,
        destination: selectedDestinationCountry,
      }));
    }
  }, [countries.destination, transactionDetails.destinationCountry]);

  useEffect(() => {
    dispatch(showLoader());
    // setLoading(true);
    const getTransactionLimit = api.transactionLimit();
    const getSourceCountries = api.getSourceCountries();
    const getExchangeRate = api.getExchangeRate();
    const getFee = api.getFee();
    const unsubscribe = Promise.all([
      getTransactionLimit,
      getSourceCountries,
      getExchangeRate,
      getFee,
    ])
      .then(values => {
        setTransactionLimit(values[0].data);
        setCountries(prevState => ({
          ...prevState,
          source: values[1].data.result,
        }));
        setExchangeRate(values[2].data);
        setFeeRange(values[3].data);
        dispatch(hideLoader());
        // setLoading(false);
      })
      .catch(err => {
        dispatch(hideLoader());
        // setLoading(false);
        setTimeout(() => {
          Alert.alert(err?.message);
        }, 2000);
      });
    return () => unsubscribe;
  }, []);

  // check if kyc is verified
  useFocusEffect(
    useCallback(() => {
      const unsubscribe =
        userData.status.isKYCVerified === false && dispatch(getCurrentUser());
      //if user is back from kyc verification, continue to next steps
      if (userData.status.isKYCVerified && onGoBack) {
        onPressContinue();
        setOnGoBack(false);
      }
      return () => unsubscribe;
    }, [userData.status.isKYCVerified, onGoBack]),
  );

  useEffect(() => {
    api.getDestinationCountries('USA').then(res => {
      setCountries(prevState => ({
        ...prevState,
        destination: res.data.result,
      }));
    });
  }, [selectedCountry.source]);

  /**
   * only set exchange rate currency when
   * both destination and source county are selected
   */
  useEffect(() => {
    if (
      selectedCurrency.destination !== undefined &&
      selectedCountry.source !== undefined &&
      exchangeRate !== undefined
    ) {
      // check the exchange rate for the selected country
      const selectedSourceCurrency = selectedCountry.source.currency.code;
      const selectedDestinationCurrency =
        selectedCurrency.destination.destinationCurrency;

      const findExchangeRate = exchangeRate.result.find(
        item =>
          item.sourceCurrency === selectedSourceCurrency &&
          item.destinationCurrency === selectedDestinationCurrency,
      );
      setExchangeRateCurrency(findExchangeRate);
    }
  }, [exchangeRate, selectedCountry, selectedCurrency]);

  /**
   * 💰exchange rate calculation💰
   */
  useEffect(() => {
    if (
      selectedCountry.destination !== undefined &&
      selectedCountry.source !== undefined
    ) {
      //calculation for transaction fee
      const currencyConversion =
        parseFloat(senderInput.value) * parseFloat(exchangeRateCurrency.rate);
      var recipientGets =
        senderInput.value === '' ? '0' : currencyConversion.toFixed(2);
      recipientInput.setValue(recipientGets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    senderInput.value,
    selectedCountry.destination,
    exchangeRateCurrency.rate,
  ]);

  // 💰setReceipent Exchange Rate💰
  useEffect(() => {
    if (selectedCountry.destination?.currency && exchangeRate) {
      const destinationCurrencyCode = selectedCountry.destination.currency.code;
      const findDestinationCurrency = exchangeRate.result.filter(
        item => item.destinationCurrency === destinationCurrencyCode,
      );
      setCurrency(prevState => ({
        ...prevState,
        destination: findDestinationCurrency,
      }));
    }
  }, [selectedCountry.destination, exchangeRate]);

  //
  const onChangeDestinationCurrency = value => {
    const findSelectedDestinationCurrency = currency.destination.find(
      item => item.destinationCurrency === value,
    );
    setSelectedCurrency(prevState => ({
      ...prevState,
      destination: findSelectedDestinationCurrency,
    }));
  };

  // Send Money to picker action
  const onSelectDestinationCountry = destinationCountryValue => {
    const selectedDestinationCountry = countries.destination.find(
      item => item.threeCharCode === destinationCountryValue,
    );
    setSelectedCountry(prevState => ({
      ...prevState,
      destination: selectedDestinationCountry,
    }));
  };

  /**
   * picker action for selecting source country
   * initialize the source country based on the change on source countries changes
   */
  const onSelectSourceCountry = useCallback(
    sourceCountryValue => {
      const selectedSourceCountry = countries.source.find(
        item => item.threeCharCode === sourceCountryValue,
      );
      setSelectedCountry(prevState => ({
        ...prevState,
        source: selectedSourceCountry,
      }));
    },
    [countries.source],
  );

  /**
   * calculate transaction feee
   * on the basis of senderAmount
   * and set min flatFee
   * also by destination country
   *
   * if amount is not in between
   * return the first index of the array
   */
  useEffect(() => {
    if (feeRange?.result && selectedCountry.destination) {
      var transactionFeeRangeFilter = [];
      feeRange.result.forEach(element => {
        const feeRanges = element.feeRanges.find((el, index) => {
          return senderInput.value >= el.minAmount &&
            senderInput.value <= el.maxAmount
            ? el
            : null;
        });
        const type = {
          currency: element.currency,
          destinationCountry: element.destinationCountry,
          feeRanges: feeRanges,
          paymentMethod: element.paymentMethod,
          payoutMethod: element.payoutMethod,
          sourceCountry: element.sourceCountry,
        };
        transactionFeeRangeFilter.push(type);
      });

      const transactionFilterByDestination = transactionFeeRangeFilter.filter(
        item =>
          selectedCountry.destination.threeCharCode === item.destinationCountry,
      );
      // set minimum flatFee
      var newFee = [];
      transactionFilterByDestination.filter(item => {
        if (item.feeRanges !== undefined) {
          let cal = calculateFlatFee({
            feeRange: item.feeRanges,
            senderAmount: senderInput.value,
          });
          newFee.push(cal);
        }
      });
      const minFlatFee = Math.min(...newFee);
      setFlatFee(minFlatFee);
      setTransactionFee(transactionFilterByDestination);
    }
  }, [
    feeRange?.result,
    senderInput.value,
    exchangeRateCurrency,
    feeRange,
    selectedCountry.destination,
  ]);

  // clear login status
  useEffect(() => {
    if (userData.isLoginFromCalculator) {
      dispatch(isLoginFromCalculator(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * dispatch with required data for transaction in transactionDetail reducer
   * check @checkTransactionLimit of the user on basis of user TIER LEVEL
   * check @review condition
   * if user navigate back from
   * the TransactionDetail Screen
   * check and navigate back to same route
   */
  const onPressContinue = () => {
    if (senderInput.value !== 0 && senderInput.value !== '0') {
      if (checkTransactionLimit(transactionLimit, senderInput.value).status) {
        const transactionDetail = {
          exchangeRate: exchangeRateCurrency.rate,
          senderAmount: senderInput.value,
          recipientAmount: recipientInput.value,
          recipientCurrency: exchangeRateCurrency.destinationCurrency,
          destinationCountry: selectedCountry.destination.threeCharCode,
          senderCurrency: exchangeRateCurrency.sourceCurrency,
          transactionFee: transactionFee,
          destination: selectedCountry.destination,
        };
        dispatch(createTransactionData(transactionDetail));

        if (review) {
          navigation.navigate(NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN, {
            routeFrom: 'SendMoney',
          });
          return;
        }
        if (checkStatus(userData?.status.kycStatus)) {
          navigation.navigate(NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN, {
            routeFrom: 'SendMoney',
          });
          if (userData?.status.kycStatus === STATUS.REVIEW_PENDING) {
            dispatch(
              showToast({
                message: 'Your information verification is in progress.',
                status: false,
              }),
            );
          }
        } else {
          navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
            widgetType: widgetType.kyc,
            routeFrom: 'SendMoney',
            onGoBack: e => setOnGoBack(true),
          });
        }
      } else {
        if (senderInput.value <= transactionLimit?.senderLimit) {
          Alert.alert(
            checkTransactionLimit(transactionLimit, senderInput.value).message,
          );
        } else {
          Alert.alert(
            'Limit Exceed.',
            'You have exceeded your limit, please click OK to increase your limit.',
            [
              {
                text: 'Cancel',
              },
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
                    widgetType: widgetType.tier,
                  }),
              },
            ],
            {cancelable: false},
          );
        }
      }
    } else {
      Alert.alert('Invalid Sender Amount');
    }
  };

  return (
    <GenericView
      // loading={loading}
      header={<Header title={'Send Money'} />}>
      <KeyboardAwareView contentContainerStyle={styles.full}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainerStyle}>
          <CountryBlock
            disabled={review}
            default={transactionDetails.destinationCountry ? false : true}
            editable={false}
            selectedValue={selectedCountry.destination?.threeCharCode}
            value={selectedCountry.destination?.name}
            label={'Send money to'}
            onValueChange={onSelectDestinationCountry}
            pickerValue={'threeCharCode'}
            data={countries.destination}
          />

          {exchangeRateCurrency?.sourceCurrency && (
            <View style={styles.rateWrapper}>
              <View style={styles.row}>
                <RegularText text="Rate: 1" style={styles.boldText} />
                <RegularText
                  text={` ${exchangeRateCurrency?.sourceCurrency} = `}
                />
                <RegularText
                  text={`${exchangeRateCurrency?.rate} `}
                  style={styles.boldText}
                />
                <RegularText
                  text={`${exchangeRateCurrency?.destinationCurrency}`}
                />
              </View>
            </View>
          )}

          <AmountBlock
            {...senderInput}
            onValueChange={onSelectSourceCountry}
            pickerValue={'threeCharCode'}
            defaultSelectedValue={selectedCountry?.source?.currency.code}
            data={countries.source}
            label={'You Send'}
          />

          {!checkTransactionLimit(transactionLimit, senderInput.value)
            .status && (
            <RegularText
              text={
                checkTransactionLimit(transactionLimit, senderInput.value)
                  .message
              }
              style={styles.errorMessage}
            />
          )}

          <AmountBlock
            editable={false}
            {...recipientInput}
            onValueChange={onChangeDestinationCurrency}
            pickerValue={'destinationCurrency'}
            data={currency.destination}
            label={'Recipient gets'}
          />

          <HorizontalView
            senderAmount={senderInput.value}
            data={transactionFee}
            symbol={'+'}
            amount={flatFee}
            currency={exchangeRateCurrency?.sourceCurrency}
            caption={'Transaction fee'}
            icon
          />

          <HorizontalView
            symbol={'='}
            amount={parseFloat(senderInput.value ?? 0) + parseFloat(flatFee)}
            caption={'Total Amount'}
            currency={exchangeRateCurrency?.sourceCurrency}
          />
          <View style={styles.listFooterComponentStyle}>
            <FooterButton
              padding
              disabled={
                senderInput.value === '0' ||
                senderInput.value < 1 ||
                senderInput.value === '' ||
                transactionLimit === undefined ||
                isNaN(senderInput.value)
              }
              text="Continue"
              onPress={onPressContinue}
            />
          </View>
        </ScrollView>
      </KeyboardAwareView>
    </GenericView>
  );
}

const styles = StyleSheet.create({
  full: {
    paddingTop: 20,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateWrapper: {
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: -10,
    marginBottom: 8,
    color: theme.red,
  },
  listFooterComponentStyle: {
    position: 'absolute',
    // top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainerStyle: {
    minHeight: '100%',
    paddingBottom: 70,
    paddingHorizontal: 15,
  },
});
