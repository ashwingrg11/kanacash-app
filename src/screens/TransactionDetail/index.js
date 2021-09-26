import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import FooterButton from '~/components/ui/FooterButton';
import {
  TransactionDetailCard,
  SenderInformationCard,
  RecipientInformationCard,
  ReviewWrapper,
  DetailsWrapper,
} from './container';
import AlertModal from '~/components/ui/AlertModal';
import {useSelector, useDispatch} from 'react-redux';
import {createTransactionData} from '~/store/actions/TransactionAction';
import * as api from '~/services/axios/Api';
import {NAVIGATION_TO_TRANSACTION_CONFIRMATION_SCREEN} from '../../navigation/routes';
import {CONTACT_NUMBER, SUPPORT_EMAIL} from '~/constants/info';
import {showLoader} from '../../store/actions/LoaderAction';
import {hideLoader} from '~/store/actions/LoaderAction';
import calculateFlatFee from '~/utils/calculateFlatFee';

const cancelledMsg = `This transaction cannot be cancelled now. Please contact customer support at ${SUPPORT_EMAIL}/${CONTACT_NUMBER} for more details"`;

export default function TransactionDetail({navigation, route}) {
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction);
  const userData = useSelector(state => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState({});

  const [alertModalVisible, setAlertModalVisible] = React.useState(false);
  const [messageModalVisible, setMessageModalVisible] = React.useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');

  const [isTransactionCancelled, setTransactionCancelled] = useState(false);

  const review = route?.params?.routeFrom;

  const roundUp = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (review) {
        const feeAmount = transaction.transactionFee.find(
          item =>
            item.paymentMethod === transaction.paymentMethod &&
            item.payoutMethod === transaction.payoutMethod &&
            item.currency === transaction.recipientCurrency &&
            item.destinationCountry === transaction.destinationCountry,
        );
        let feeAmountCal = 0;
        if (feeAmount.feeRanges !== undefined) {
          feeAmountCal = calculateFlatFee({
            feeRange: feeAmount.feeRanges,
            senderAmount: transaction.senderAmount,
          });
        }
        const updateTransactionDetails = {
          feeRange: feeAmount.feeRanges,
          feeAmount: roundUp(feeAmountCal, 2),
        };

        dispatch(createTransactionData(updateTransactionDetails));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      review,
      transaction.paymentMethod,
      transaction.payoutMethod,
      transaction.senderAmount,
      transaction.transactionFee,
    ]),
  );

  React.useEffect(() => {
    api.getBanks().then(res => {
      if (res.status === 200) {
        const filterData = res.data.result.find(
          item => item.id === transaction.senderFundingSourceAccountId,
        );
        setPaymentMethod(filterData);
      }
    });
  }, [transaction.senderFundingSourceAccountId]);

  /**
   *check for minimum amount to be send by sender
   */
  const onSaveAndContinue = () => {
    // if (transaction.senderAmount >= transaction.feeRange.minAmount) {
    navigation.navigate(NAVIGATION_TO_TRANSACTION_CONFIRMATION_SCREEN);
    // } else {
    //   let modalConfig = {
    //     message: `Transaction Amount should be greater than ${
    //       transaction.feeRange.minAmount
    //     }`,
    //     message_title: `Sorry`,
    //   };
    //   dispatch(setError(modalConfig));
    // }
  };

  const showCancelledMsg = () => {
    dispatch(hideLoader());
    setTimeout(() => {
      setTransactionMessage(cancelledMsg);
      setMessageModalVisible(true);
    }, 1000);
  };

  const onPressCancelTransaction = () => {
    dispatch(showLoader());
    api
      .cancelTransaction(transaction.referenceId)
      .then(res => {
        dispatch(hideLoader());
        console.log('res', res);
        if (res.status === 200) {
          setTransactionMessage(
            'Your Transaction has been canceled successfully',
          );
          setTransactionCancelled(true);
        } else {
          showCancelledMsg();
        }
        setMessageModalVisible(true);
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => {
        showCancelledMsg();
      });
  };

  const onPressOk = () => {
    setAlertModalVisible(false);
    onPressCancelTransaction();
  };

  return (
    <GenericView
      padding
      scrollable
      header={
        <Header
          title={review ? 'Review' : 'Transaction Details'}
          backButtonVisible={!review}
        />
      }>
      {review ? (
        <ReviewWrapper />
      ) : (
        <DetailsWrapper
          isTransactionCancelled={isTransactionCancelled}
          transaction={transaction}
          onPressCloseIcon={() => setAlertModalVisible(!alertModalVisible)}
        />
      )}

      <TransactionDetailCard data={transaction} review={review} />
      <SenderInformationCard
        data={transaction}
        userInfo={userData}
        paymentMethod={paymentMethod}
        review={review}
      />
      <RecipientInformationCard data={transaction} review={review} />
      {/* <RemittanceCard /> */}

      {review && (
        <FooterButton
          text="Submit & Continue"
          onPress={onSaveAndContinue}
          style={styles.continueBtn}
        />
      )}

      {alertModalVisible && (
        <AlertModal
          message="Are you sure you want to cancel the transaction?"
          visible={alertModalVisible}
          onPressOk={onPressOk}
          onRequestClose={() => setAlertModalVisible(!alertModalVisible)}
        />
      )}

      {messageModalVisible && (
        <AlertModal
          title="Message"
          message={transactionMessage}
          visible={messageModalVisible}
          onPressOk={() => setMessageModalVisible(false)}
          onRequestClose={() => setMessageModalVisible(false)}
          closeButton={'Close'}
        />
      )}
    </GenericView>
  );
}

const styles = StyleSheet.create({
  continueBtn: {
    marginBottom: 20,
  },
});
