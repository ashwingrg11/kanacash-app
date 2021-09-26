import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {RegularText, SemiBoldText} from '~/components/ui/Text';
import {CloseIcon} from '~/components/ui/Icon';
import {statusStyle} from '~/utils/checkTransactionStatus';
import Invoice from './Invoice';
import moment from 'moment';

export default function DetailsWrapper({
  transaction,
  isTransactionCancelled,
  onPressCloseIcon,
}) {
  const currentStatus = isTransactionCancelled
    ? 'CANCELED'
    : transaction.status;

  const deliveryStatus = isTransactionCancelled
    ? 'HOLD'
    : transaction.deliveryStatus;

  const modifiedDate = moment(new Date(transaction.createdAt)).format(
    'MM/DD/yyyy',
  );

  const isTxnCancelable = status => {
    if (
      status === 'CANCELED' ||
      status === 'DELIVERED' ||
      status === 'RETURNED' ||
      status === 'REFUNDED'
    ) {
      return false;
    }
    return true;
  };

  return (
    <React.Fragment>
      <SemiBoldText
        text={`Transaction of ${transaction.beneficiary.fullName}`}
      />
      <RegularText text={`Transaction Date: ${modifiedDate}`} />

      <View
        style={[styles.rowGroup, styles.spaceBetween, styles.marginVertical]}>
        <View style={styles.rowGroup}>
          <View style={styles.dotStyle(statusStyle(currentStatus))} />
          <View style={styles.textWrapper}>
            <RegularText text={'Transaction Status'} numberOfLines={1} />
            <RegularText
              text={currentStatus}
              style={styles.statusTextStyle(statusStyle(currentStatus))}
            />
          </View>
        </View>
        <Invoice transactionId={transaction.referenceId} />
      </View>

      <View
        style={[styles.rowGroup, styles.spaceBetween, styles.marginVertical]}>
        <View style={styles.rowGroup}>
          <View style={styles.dotStyle(statusStyle(deliveryStatus))} />
          <View style={styles.textWrapper}>
            <RegularText text={'Delivery Status'} />
            <RegularText
              text={deliveryStatus.replace('_', ' ')}
              style={styles.statusTextStyle(statusStyle(deliveryStatus))}
            />
          </View>
        </View>

        {isTxnCancelable(transaction.status) &&
          (currentStatus === 'INITIATED' || currentStatus === 'PENDING') && (
            <View>
              <TouchableOpacity
                onPress={onPressCloseIcon}
                style={[styles.rowGroup]}>
                <CloseIcon color={'red'} />
                <RegularText text="  Cancel" />
              </TouchableOpacity>
            </View>
          )}
      </View>

      {isTransactionCancelled ||
        (transaction.status === 'CANCELED' && (
          <View style={styles.rowGroup}>
            <RegularText text={'This Transaction has been Canceled'} />
          </View>
        ))}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  spaceBetween: {
    justifyContent: 'space-between',
  },
  rowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 4,
  },
  closeWrapper: {
    // marginLeft: 30,
  },
  continueBtn: {
    marginBottom: 20,
  },
  marginVertical: {
    marginVertical: 10,
  },
  dotStyle: statusColor => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: statusColor,
    marginRight: 8,
  }),
  statusTextStyle: statusColor => ({
    color: statusColor,
  }),
  textWrapper: {
    flex: 1,
  },
});
