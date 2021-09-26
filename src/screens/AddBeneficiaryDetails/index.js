import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import theme from '~/components/theme/Style';
import {SemiBoldText, MediumText} from '~/components/ui/Text';
import FooterButton from '~/components/ui/FooterButton';
import ExpandableBlock from '~/components/ui/ExpandableBlock';
import {Outline, Done} from '~/components/ui/Icon';
import {layoutAnimation} from '~/presentation';
import PickerModal from '~/components/ui/PickerModal';
import * as api from '~/services/axios/Api';
import {useSelector, useDispatch} from 'react-redux';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {useFocusEffect} from '@react-navigation/native';
import checkAvailablePayoutMethod from '~/utils/checkAvailablePayoutMethod';
import receiveMethod, {
  CASH_PICKUP,
  BANK_DEPOSIT,
  HOME_DELIVERY,
  WALLET,
} from '~/constants/receiveMethod';
import {
  NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN,
  NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN,
  NAVIGATION_TO_PAYOUT_METHOD_SCREEN,
  NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN,
} from '../../navigation/routes';
import {
  CashPickupBlock,
  BankDepositBlock,
  HomeDeliveryBlock,
  WalletBlock,
} from './container';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';

export default function AddBeneficiaryDetails({navigation, route}) {
  const dispatch = useDispatch();
  const transactionDetails = useSelector(state => state.transaction);
  const [beneficiaries, setBeneficiaries] = useState(undefined);
  const [payersList, setPayersList] = useState([]);
  const [banksList, setBanksList] = useState([]);

  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(undefined);
  const [selectedBeneficiaryBank, setSelectedBeneficiaryBank] = useState('');
  const [selectedBeneficiaryWallet, setSelectedBeneficiaryWallet] = useState(
    '',
  );
  const [selecetedPayer, setSelectedPayer] = useState({});

  const [loading, setLoading] = useState(true);
  const [addBank, setAddBank] = useState(false);

  const review = route?.params?.routeFrom === 'review';
  let walletSendingAmount =
    transactionDetails.destination?.sendingAmountLimit?.wallet;

  React.useEffect(() => {
    if (!loading) {
      if (review) {
        const {
          payoutMethod,
          beneficiary,
          payer,
          BeneficiaryBank,
          recipientBankId,
        } = transactionDetails;
        setSelectedBlock(payoutMethod);
        api.getBeneficiaries().then(res => {
          const data = res.data.result.find(
            item => item.referenceId === beneficiary.referenceId,
          );
          setSelectedBeneficiary(data);
          if (payoutMethod === CASH_PICKUP) {
            setSelectedPayer(payer);
          } else if (payoutMethod === BANK_DEPOSIT) {
            const filterBeneficiaryBank = data.banks.find(
              item => item.referenceId === BeneficiaryBank.referenceId,
            );
            setSelectedBeneficiaryBank(filterBeneficiaryBank);
          } else if (payoutMethod === WALLET) {
            const selectedValue = data.wallets.find(
              item => item.referenceId === recipientBankId,
            );
            setSelectedBeneficiaryWallet(selectedValue);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const _getBeneficiaries = () => {
    api.getBeneficiaries().then(res => {
      const data = res.data.result.filter(
        item =>
          item.address.country === transactionDetails.destination.threeCharCode,
      );
      setBeneficiaries(data);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = _getBeneficiaries();
      return () => unsubscribe;
    }, []),
  );

  const setLoadingIndicator = indicatorValue => {
    if (indicatorValue) {
      setLoading(true);
      dispatch(showLoader());
    } else {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  React.useEffect(() => {
    setLoadingIndicator(true);
    let getPayersList = null;
    let getBanksByCountry = null;
    const pymt = transactionDetails.destination.payoutMethod;
    if (checkAvailablePayoutMethod(pymt, 'isCashPickupEnabled')) {
      getPayersList = api.getPayersList(transactionDetails.destinationCountry);
    }
    if (checkAvailablePayoutMethod(pymt, 'isBankDepositEnabled')) {
      getBanksByCountry = api.getBanksByCountry(
        transactionDetails.destinationCountry,
      );
    }
    const unsubscribe = Promise.all([getPayersList, getBanksByCountry])
      .then(values => {
        getPayersList && setPayersList(values[0].data.result);
        getBanksByCountry && setBanksList(values[1].data.result);
        setLoadingIndicator(false);
      })
      .then(error => {
        setLoadingIndicator(false);
      });

    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    transactionDetails.destination.payoutMethod,
    transactionDetails.destinationCountry,
  ]);

  const onChangePayers = payersValue => {
    const payersListFilter = payersList.find(item => item.name === payersValue);
    setSelectedPayer(payersListFilter);
  };

  // Select Beneficiary name
  const onChangeBeneficiary = beneficiaryValue => {
    const filterBaneficiary = beneficiaries.find(
      item => item.fullName === beneficiaryValue,
    );
    setSelectedBeneficiary(filterBaneficiary);
    onSelectBlock(undefined);
    layoutAnimation();
    setSelectedBeneficiaryBank('');
    setSelectedBeneficiaryWallet('');
  };

  // to show and hide block
  const onSelectBlock = value => {
    if (beneficiaries === undefined) {
      Alert.alert('Please Select Beneficiary first!');
    } else {
      if (value === CASH_PICKUP) {
        setSelectedBeneficiaryBank('');
        setSelectedBeneficiaryWallet('');
      } else if (value === BANK_DEPOSIT) {
        setSelectedPayer('');
        setSelectedBeneficiaryWallet('');
      }
      layoutAnimation();
      setSelectedBlock(value);
    }
  };

  const onAddBeneficiaryBank = addedBank => {
    _getBeneficiaries();
    const updateSelectedBeneficiary = {
      ...selectedBeneficiary,
      banks: [...selectedBeneficiary.banks, addedBank],
    };
    setSelectedBeneficiary(updateSelectedBeneficiary);
    setSelectedBeneficiaryBank(addedBank);
    // bankName
  };

  const onChangeBeneficiaryBank = value => {
    if (addBank) {
      setAddBank(false);
    } else {
      const selectedValue = selectedBeneficiary.banks.find(
        item => item.bankName === value,
      );
      setSelectedBeneficiaryBank(selectedValue);
    }
  };

  const onAddBeneficiaryWallet = addedWallet => {
    _getBeneficiaries();
    const updateSelectedBeneficiary = {
      ...selectedBeneficiary,
      wallets: [...selectedBeneficiary.wallets, addedWallet],
    };
    setSelectedBeneficiary(updateSelectedBeneficiary);
    setSelectedBeneficiaryWallet(addedWallet);
  };

  /**
   * for some reason this function is being 🤙
   * called every time when we add wallet
   * so to prevent it from invoking
   * add bank state is being used to block
   * to ren
   */
  const onChangeBeneficiaryWallet = value => {
    if (addBank) {
      setAddBank(false);
    } else {
      const selectedValue = selectedBeneficiary.wallets.find(
        item => item.identificationValue === value,
      );
      setSelectedBeneficiaryWallet(selectedValue);
    }
  };

  const renderBlock = blockType => {
    var block = null;
    switch (blockType) {
      case CASH_PICKUP:
        block = (
          <CashPickupBlock
            data={payersList}
            pickerValue={'name'}
            onValueChange={onChangePayers}
            value={selecetedPayer}
            default={!review}
          />
        );
        break;
      case BANK_DEPOSIT:
        block = (
          <BankDepositBlock
            pickerValue={'bankName'}
            // baneficiary bank picker
            pickOptions={selectedBeneficiary.banks ?? []}
            onValueChange={onChangeBeneficiaryBank}
            value={selectedBeneficiaryBank}
            default={!review}
            beneficiaryId={selectedBeneficiary.referenceId}
            banksList={banksList}
            onPressAddBank={value => setAddBank(value)}
            onSuccessAddBeneficiaryBank={res => onAddBeneficiaryBank(res)}
          />
        );
        break;
      case HOME_DELIVERY:
        block = (
          <HomeDeliveryBlock
            item={selectedBeneficiary}
            onSelectHomeDelivery={res => setSelectedPayer(res)}
          />
        );
        break;
      case WALLET:
        block = (
          <WalletBlock
            walletSendingAmount={walletSendingAmount}
            senderAmount={transactionDetails.senderAmount}
            pickerValue={'identificationValue'}
            pickOptions={selectedBeneficiary.wallets ?? []}
            beneficiaryId={selectedBeneficiary.referenceId}
            onValueChange={onChangeBeneficiaryWallet}
            value={selectedBeneficiaryWallet}
            default={!review}
            onPressAdd={value => setAddBank(value)}
            onSuccessAddBeneficiaryWallet={res => onAddBeneficiaryWallet(res)}
          />
        );
        break;
      default:
        break;
    }

    return block;
  };

  const renderReceiveMethod = ({item}) => {
    const walletTitle =
      transactionDetails.destinationCountry === 'KEN'
        ? 'M-Pesa Wallet'
        : 'MTN Wallet';
    return selectedBlock === undefined ? (
      checkAvailablePayoutMethod(
        transactionDetails.destination.payoutMethod,
        item.value,
      ) ? (
        <ExpandableBlock
          onPress={() => {
            if (selectedBeneficiary !== undefined) {
              onSelectBlock(item.payoutMethod);
            } else {
              Alert.alert('Please, selected beneficiary first');
            }
          }}
          containerStyle={styles.blockContainer}
          leftContent={item.icon}
          title={item.payoutMethod === 'WALLET' ? walletTitle : item.title}
          caption={item.caption}
          rightContent={<Outline />}
        />
      ) : null
    ) : item.payoutMethod === selectedBlock ? (
      <ExpandableBlock
        onPress={() => onSelectBlock(undefined)}
        containerStyle={styles.blockContainer}
        leftContent={item.icon}
        title={item.payoutMethod === 'WALLET' ? walletTitle : item.title}
        caption={item.caption}
        rightContent={<Done size={30} />}
        content={renderBlock(item.payoutMethod)}
      />
    ) : null;
  };

  const onPressContinue = () => {
    let recipientBankId = '';

    if (selectedBlock === WALLET) {
      recipientBankId = selectedBeneficiaryWallet.referenceId;
    } else if (selectedBlock === BANK_DEPOSIT) {
      recipientBankId =
        selectedBeneficiaryBank.referenceId !== undefined
          ? selectedBeneficiaryBank.referenceId
          : ''; // ID obtained from /v1/senders/beneficiaries/bank
    }

    const transactionDetail = {
      recipientId: selectedBeneficiary.referenceId, //ID of beneficiary
      recipientBankId: recipientBankId, // ID obtained from /v1/senders/beneficiaries/bank,
      payerId:
        selecetedPayer.referenceId !== undefined
          ? selecetedPayer.referenceId
          : '', //ID obtained from /v1/payers",
      payoutMethod: selectedBlock,
      beneficiary: selectedBeneficiary,
      payer: selecetedPayer,
      BeneficiaryBank: selectedBeneficiaryBank,
      wallet: selectedBeneficiaryWallet,
    };

    if (review) {
      dispatch(createTransactionData(transactionDetail));
      navigation.navigate(NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN);
      return;
    }

    if (route?.params?.routeFrom === 'SendMoney') {
      dispatch(createTransactionData(transactionDetail));
      navigation.navigate(NAVIGATION_TO_PAYOUT_METHOD_SCREEN);
    } else {
      // check route
      navigation.navigate(NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN);
    }
  };

  /**
   * disabled footer
   * bottom condition
   */
  const btnDisabled = () => {
    let disabled = true;
    if (selectedBeneficiary === undefined) {
      disabled = true;
    } else {
      if (selectedBlock) {
        if (selectedBlock === HOME_DELIVERY) {
          const isHomeDeliveryEnabled =
            selectedBeneficiary.address.state === 'Yerevan';
          disabled = !isHomeDeliveryEnabled;
        } else if (selectedBlock === BANK_DEPOSIT && !selectedBeneficiaryBank) {
          disabled = true;
        } else if (selectedBlock === WALLET && !selectedBeneficiaryWallet) {
          disabled = true;
        } else {
          if (
            selectedBlock === WALLET &&
            transactionDetails.senderAmount > walletSendingAmount
          ) {
            disabled = true;
          } else {
            disabled = false;
          }
        }
      }
    }
    return disabled;
  };

  const navigateToCreateBeneficiary = () => {
    navigation.navigate(NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN, {
      routeFrom: 'AddBeneficiaryDetails',
    });
  };

  return (
    <GenericView padding header={<Header title="Add Beneficiary" />}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.keyboardAwareViewContainer}>
        <FlatList
          ListHeaderComponent={
            <React.Fragment>
              <SemiBoldText
                text="Beneficiary details"
                style={[styles.headerText]}
              />
              <PickerModal
                onPressEmptyPicker={navigateToCreateBeneficiary}
                placeholder="Select Beneficiary"
                label={'Please Select Beneficiary'}
                pickOptions={beneficiaries === undefined ? [] : beneficiaries}
                pickerValue={'fullName'}
                onValueChange={onChangeBeneficiary}
                value={selectedBeneficiary}
                default={false}
              />

              <View style={styles.createBeneficiaryStyle}>
                <MediumText text="or, " style={[styles.primaryText]} />
                <TouchableOpacity onPress={navigateToCreateBeneficiary}>
                  <MediumText
                    text="Create New Beneficiary"
                    style={[styles.redText]}
                  />
                </TouchableOpacity>
              </View>
              {!loading && selectedBeneficiary !== undefined && (
                <MediumText
                  text="Please Select Receive Method"
                  style={[styles.primaryText]}
                />
              )}
            </React.Fragment>
          }
          showsVerticalScrollIndicator={false}
          data={
            !loading && selectedBeneficiary !== undefined ? receiveMethod : []
          }
          // extraData={selectedBeneficiary}
          renderItem={renderReceiveMethod}
          keyExtractor={item => item.title}
          ListFooterComponent={
            <FooterButton
              disabled={btnDisabled()}
              text="Continue"
              onPress={onPressContinue}
            />
          }
          contentContainerStyle={styles.contentContainerStyle}
          ListFooterComponentStyle={styles.listFooterComponentStyle}
        />
      </KeyboardAwareScrollView>
    </GenericView>
  );
}

const styles = StyleSheet.create({
  keyboardAwareViewContainer: {flex: 1},
  headerText: {
    marginBottom: 15,
  },
  primaryText: {
    color: theme.primaryColor,
  },
  optionContainer: {
    marginTop: 30,
  },
  blockContainer: {
    marginVertical: 10,
  },
  createBeneficiaryStyle: {
    marginTop: 20,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redText: {color: theme.red},
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
});
