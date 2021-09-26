import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Alert, Text} from 'react-native';
import GenericView from '~/components/ui/GenericView';
import AuthHeader from '~/components/ui/AuthHeader';
import {RegularText} from '~/components/ui/Text';
import useFormInput from '~/hooks/useFormInput';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {isLoginFromCalculator} from '~/store/actions/AuthAction';
import {useDispatch} from 'react-redux';
import * as api from '~/services/axios/Api';
import Button from '~/components/ui/Button';
import AmountBlock from '~/components/ui/AmountBlock';
import HorizontalView from '~/components/ui/HorizontalView';
import CountryBlock from '~/components/ui/CountryBlock';
import {
  NAVIGATION_TO_AUTH_OPTION_SCREEN,
  NAVIGATION_TO_LOGIN_SCREEN,
} from '../../navigation/routes';
import theme from '~/components/theme/Style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardAwareView from '~/presentation/KeyboardAwareView';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';
import calculateFlatFee from '../../utils/calculateFlatFee';

/**
 * @author sushant suwal
 * @export
 * @param {*} {navigation}
 * @returns
 */
export default function SendMoney({navigation, route}) {
  const dispatch = useDispatch();
  // form
  const senderInput = useFormInput('1'); //send amount
  const recipientInput = useFormInput('0'); //recipient Input

  // APIs data
  const [exchangeRate, setExchangeRate] = useState(undefined);
  const [feeRange, setFeeRange] = useState(undefined);
  // data for drowdownlist
  const [countries, setCountries] = useState({
    destination: [],
    source: [],
  });
  //dropdown selected list
  const [selectedCountry, setSelectedCountry] = useState({
    destination: undefined,
    source: undefined,
  });
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

  useEffect(() => {
    dispatch(showLoader());
    const getSourceCountries = api.getSourceCountries();
    const getExchangeRate = api.getExchangeRate();
    const getFee = api.getFee();
    const unsubscribe = Promise.all([
      getSourceCountries,
      getExchangeRate,
      getFee,
    ])
      .then(values => {
        setCountries(prevState => ({
          ...prevState,
          source: values[0].data.result,
        }));
        setExchangeRate(values[1].data);
        setFeeRange(values[2].data);
        dispatch(hideLoader());
      })
      .catch(err => console.log('i am error', err));
    return () => unsubscribe;
  }, []);

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
      // const findFee = feeRange?.result.find(
      //   feeItem =>
      //     feeItem.sourceCountry === selectedCountry.source.sourceCurrency &&
      //     feeItem.destinationCountry ===
      //       selectedCurrency.destination.destinationCurrency,
      // );
      // setFee(findFee);
    }
  }, [exchangeRate, selectedCountry, selectedCurrency]);

  /**
   * exchange rate calculation
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

  // setReceipent Exchange Reate
  React.useEffect(() => {
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
   * initalize the source country based on the change on source countries changes
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
  React.useEffect(() => {
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

      let transactionFilterByDestination = transactionFeeRangeFilter.filter(
        item =>
          selectedCountry.destination.threeCharCode === item.destinationCountry,
      );

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

  const onPressContinue = () => {
    // dispatch with required data for transaction
    if (senderInput.value !== 0 && senderInput.value !== '0') {
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
      dispatch(isLoginFromCalculator(true));
      navigation.navigate(NAVIGATION_TO_AUTH_OPTION_SCREEN);
    } else {
      Alert.alert('Invalid Sender Amount');
    }
  };

  const onPressLogin = () => {
    dispatch(isLoginFromCalculator(false));
    navigation.navigate(NAVIGATION_TO_LOGIN_SCREEN);
  };

  return (
    <KeyboardAwareView style={styles.container}>
      <GenericView padding keyboardView scrollable>
        <View style={styles.headerWrapper}>
          <AuthHeader
            title={'Send Money'}
            containerStyle={styles.authContainerStyle}
            logoStyle={styles.authLogoStyle}
          />
          <View>
            <TouchableOpacity onPress={onPressLogin}>
              <View style={styles.loginWrapper}>
                <Text style={styles.loginStyle}>Login</Text>
                <Icon name={'md-arrow-forward'} style={styles.loginStyle} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <CountryBlock
          editable={false}
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

        {senderInput.value > 3000 && (
          <RegularText
            text={'Maximum amount is $ 3000'}
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
          amount={
            parseFloat(senderInput.value === '' ? 0 : senderInput.value) +
            parseFloat(flatFee)
          }
          caption={'Total Amount'}
          currency={exchangeRateCurrency?.sourceCurrency}
        />

        <View style={styles.btnWrapper}>
          <Button
            text="Continue"
            disabled={
              // loading ||
              senderInput.value === '0' ||
              senderInput.value === '' ||
              senderInput.value <= 0 ||
              senderInput.value > 3000 ||
              isNaN(senderInput.value)
            }
            onPress={onPressContinue}
            style={styles.btnStyle}
          />
        </View>
      </GenericView>
    </KeyboardAwareView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
  authContainerStyle: {
    marginTop: -50,
  },
  authLogoStyle: {marginBottom: 50},
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
  btnStyle: {
    marginTop: 10,
  },
  btnWrapper: {
    marginVertical: 10,
  },
  errorMessage: {
    marginTop: -10,
    marginBottom: 8,
    color: theme.red,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.primaryColor,
    marginLeft: 10,
  },
  loginWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
