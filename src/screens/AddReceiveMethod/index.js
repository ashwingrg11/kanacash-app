import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import ExpandableBlock from '~/components/ui/ExpandableBlock';
import receiveMethod, {
  CASH_PICKUP,
  BANK_DEPOSIT,
  HOME_DELIVERY,
  WALLET,
  walletTitle,
  walletConfig,
} from '~/constants/receiveMethod';
import addReceiverDetail from '~/constants/addReceiverDetail';
import {
  NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN,
  NAVIGATION_TO_BENEFICIARY_SCREEN,
  NAVIGATION_TO_PAYOUT_METHOD_SCREEN,
} from '../../navigation/routes';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {
  AddBeneficiarybank,
  AddCashPickUp,
  AddHomeDelivery,
  AddWallet,
} from './container';
import {showToast} from '~/store/actions/ToastAction';

export default function AddReceiveMethod({navigation, route}) {
  const dispatch = useDispatch();
  // const TransactionDetails = useSelector(state => state.transaction);
  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(undefined);

  const isRouteFromAddBeneficiaryDetails =
    route?.params?.routeFrom === 'AddBeneficiaryDetails';
  const walletError = route?.params?.error;

  const country = route.params?.beneficary?.address.country;

  React.useEffect(() => {
    const {beneficary, selectedBlock: selectedBlockParams} = route.params;
    setSelectedBlock(selectedBlockParams);
    setSelectedBeneficiary(beneficary);
  }, [route.params]);

  // selectedBeneficiaryBank,
  const onPressContinue = (
    selectedBeneficiaryBank = null,
    selectedPayer = null,
    message,
  ) => {
    dispatch(showToast({message: message, status: true}));
    if (isRouteFromAddBeneficiaryDetails) {
      const beneficiary = {
        ...selectedBeneficiary,
      };
      const transactionDetail = {
        recipientId: selectedBeneficiary.referenceId, //ID of beneficiary
        recipientBankId:
          selectedBeneficiaryBank !== null
            ? selectedBeneficiaryBank.referenceId
            : '', // ID obtained from /v1/senders/beneficiaries/bank
        payerId: selectedPayer !== null ? selectedPayer.referenceId : '', //ID obtained from /v1/payers",
        payer: selectedPayer,
        payoutMethod: selectedBlock,
        beneficiary: beneficiary,
        BeneficiaryBank: selectedBeneficiaryBank,
      };
      dispatch(createTransactionData(transactionDetail));
      navigation.navigate(NAVIGATION_TO_PAYOUT_METHOD_SCREEN, {
        routeFrom: 'AddBeneficiaryDetails',
      });
    } else {
      navigation.popToTop();
    }
  };

  const onPressBack = () => {
    if (isRouteFromAddBeneficiaryDetails) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          key: null,
          routes: [{name: NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          key: null,
          routes: [{name: NAVIGATION_TO_BENEFICIARY_SCREEN}],
        }),
      );
    }
  };

  const renderBlock = blockType => {
    var block = null;
    switch (blockType) {
      case CASH_PICKUP:
        var message = 'Beneficiary cash pickup has been successfully added';
        block = (
          <AddCashPickUp
            pickerValue={'name'}
            default={false}
            onPressContinue={res => onPressContinue(null, res, message)}
            onPressBack={onPressBack}
          />
        );
        break;
      case BANK_DEPOSIT:
        var message = 'Beneficiary bank has been successfully added';
        block = (
          <AddBeneficiarybank
            beneficiaryId={selectedBeneficiary.referenceId}
            onPressContinue={res => onPressContinue(res, null, message)}
            onPressBack={onPressBack}
            countryCode={route.params.beneficary.address.country}
          />
        );
        break;
      case HOME_DELIVERY:
        var message = 'Beneficiary home delivery has been successfully added';
        block = (
          <AddHomeDelivery
            onPressContinue={res => onPressContinue(null, res, message)}
          />
        );
        break;
      case WALLET:
        var message = 'Beneficiary mobile Wallet has been successfully added';
        block = (
          <AddWallet
            beneficiaryId={selectedBeneficiary.referenceId}
            onPressContinue={res => onPressContinue(res, null, message)}
            identificationNumber={
              route.params?.beneficary?.identificationNumber
            }
            walletError={walletError}
          />
        );
        break;
      default:
        block = null;
    }
    return block;
  };

  const renderExpandableBlock = renderMethod => {
    const data = renderMethod.find(item => item.payoutMethod === selectedBlock);
    return (
      <ExpandableBlock
        containerStyle={styles.blockContainer}
        leftContent={data?.icon}
        title={selectedBlock === 'WALLET' ? walletTitle(country) : data?.title}
        caption={
          selectedBlock === 'WALLET' ? walletConfig(country) : data?.caption
        }
        content={renderBlock(selectedBlock)}
      />
    );
  };

  return (
    <GenericView padding header={<Header title="Add Receiver Details" />}>
      {renderExpandableBlock(
        isRouteFromAddBeneficiaryDetails ? receiveMethod : addReceiverDetail,
      )}
    </GenericView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    marginBottom: 15,
  },

  blockContainer: {
    marginVertical: 10,
  },

  contentContainerStyle: {
    minHeight: '100%',
    paddingBottom: 70,
  },
  continueBtn: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 18,
  },
});
