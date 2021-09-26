import React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import theme from '~/components/theme/Style';
// support@KanaCash/1-800-498-0623
export const CONTACT_NUMBER = '1-800-498-0623';
export const PHONE_NUMBER = '+1 8004980623';
export const EMAIL = 'customer_service@kanacash.com';
export const SUPPORT_EMAIL = 'info@kanacash.com';
export const LICENCE = 'Golden Money Transfer (GMT)';
export const LICENCE_SHORT = 'GMT';
export const APP_NAME = 'KanaCash';
export const URL = 'https://machpay.net/golden-money-transfer/kanacash/';

// I authorize |Name of FI Partner| via |Name of SMP| which is a Marketing
// Affiliate of |Name of FI Partner| to debit the bank account indicated in
// this web form for the noted amount on today's date. I will not dispute
// |Name of FI Partner| debiting my checking/savings account, so long as
// the transaction corresponds to the terms indicated in this web form.
// (Note: The funds for your money transfer will be debited from your bank
// account by | Name of FI Partner | via Tabapay.Click here for details.).
// Click Yes to continue or click Cancel

export const AUTHORIZATION = () => {
  const onPressLink = () => {
    Linking.openURL(URL).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.termContainer}>
      <Text style={styles.descriptionText}>
        I authorize <Text style={styles.boldText}>{LICENCE}</Text> via{' '}
        {APP_NAME} which is a Marketing Affiliate of{' '}
        <Text style={styles.boldText}>{LICENCE}</Text> to debit the bank account
        indicated in this web form for the noted amount on today's date. I will
        not dispute <Text style={styles.boldText}>{LICENCE}</Text> debiting my
        checking/savings account, so long as the transaction corresponds to the
        terms indicated in this web form. (Note: The funds for your money
        transfer will be debited from your bank account by{' '}
        <Text style={styles.boldText}>{LICENCE}</Text> via Tabapay. Click{' '}
        <Text style={styles.link} onPress={onPressLink}>
          here{' '}
        </Text>
        for details.).
      </Text>
      <Text />
      <Text style={styles.descriptionText}>
        Click <Text style={styles.boldText}>Yes</Text> to continue or click{' '}
        <Text style={styles.boldText}>Back</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  termContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  descriptionText: {
    fontFamily: theme.themeFontRegular,
    fontSize: theme.fontSizeRegular,
    lineHeight: 25,
    color: '#5C5C5C',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
    color: '#1f1f1f',
  },
  link: {
    color: 'lightblue',
  },
});
