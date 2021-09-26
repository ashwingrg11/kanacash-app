import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MediumText} from '~/components/ui/Text';
import theme from '~/components/theme/Style';
import {TransactionList} from '~/screens/Shared';
import {
  NAVIGATION_TO_TRANSACTIONS_SCREEN,
  NAVIGTION_TO_WIDGETS_SCREEN,
} from '../../../navigation/routes';
import widgetType from '~/constants/widgetType';
import STATUS from '~/constants/widgetStatus';

const ProfileComplete = ({status}) => {
  const navigation = useNavigation();
  const [transactionCount, setTransactionCount] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(true);

  return (
    <TransactionList
      renderTotal
      onChangeTransactionList={(num, fetching) => {
        setTransactionCount(num);
        setIsFetching(fetching);
      }}
      ListHeaderComponent={
        <React.Fragment>
          {!isFetching && transactionCount >= 1 && (
            <View>
              {status?.kycStatus === STATUS.REVIEW_PENDING && (
                <View>
                  <Text style={styles.textStyle}>
                    Your transaction is under review. We may require additional
                    information. A customer support representative will contact
                    you soon.
                  </Text>
                </View>
              )}
              {(status?.kycStatus === STATUS.RETRY_REQUESTED ||
                status?.kycStatus === STATUS.DOCUMENT_REQUESTED) && (
                <View>
                  <Text style={styles.textStyle}>
                    We require additional information from you to process your
                    transaction. Please
                    <Text
                      style={styles.linkText}
                      onPress={() =>
                        navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
                          widgetType: widgetType.kyc,
                        })
                      }>
                      {' '}
                      click here{' '}
                    </Text>
                    to submit.
                  </Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.listHeaderComponentStyle}>
            <MediumText text="Recent transactions" />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NAVIGATION_TO_TRANSACTIONS_SCREEN)
              }>
              <MediumText text="View all" style={[styles.footerText]} />
            </TouchableOpacity>
          </View>
        </React.Fragment>
      }
    />
  );
};

export default ProfileComplete;

const styles = StyleSheet.create({
  listHeaderComponentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerText: {
    color: theme.red,
  },
  textStyle: {
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#0000FF',
  },
});
