import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import theme from '~/components/theme/Style';
import {MediumText, RegularText} from '~/components/ui/Text';
import {Number} from '~/components/ui/Icon';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

const LOGIN_REQUIRED = 'LOGIN_REQUIRED';
export default function PaymentMethodCard({
  title,
  caption,
  leftContent,
  backgroundColor,

  cardType,
  num,
  first,
  second,
  verificationStatus,
  onPressRemove,
  onPressRefresh,
}) {
  const paymentType = status => {
    let text = {
      first: 'hello ',
      second: '',
      button: '',
    };
    switch (status) {
      case 'bank':
        text = {
          first: 'Account Holder: ',
          second: 'Account Type: ',
          button: 'Remove Bank',
        };
        break;
      case 'debt':
        text = {
          first: 'Nick Name: ',
          second: 'Network: ',
          button: 'Remove Card',
        };
        break;

      default:
        text = {
          first: '',
          second: '',
          third: '',
        };
    }
    return {text};
  };

  return (
    <View style={styles.container}>
      <Number style={styles.numberStyle} num={num} />
      <View style={styles.textWrapper}>
        <View style={styles.titleWrapper}>
          <MediumText text={title} />
          {verificationStatus === LOGIN_REQUIRED && (
            <Icon
              onPress={onPressRefresh}
              name={'md-refresh'}
              style={styles.iconStyle}
            />
          )}
        </View>
        <View style={styles.row}>
          <RegularText text={paymentType(cardType).text.first} />
          <Text>{first}</Text>
        </View>
        <View style={styles.row}>
          <RegularText text={paymentType(cardType).text.second} />
          <Text numberOfLines={1}>{second}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={onPressRemove}
            style={styles.removeButtonStyle}>
            <RegularText
              text={paymentType(cardType).text.button}
              style={styles.buttonTextStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightContentStyle} />
    </View>
  );
}

PaymentMethodCard.defaultProps = {};

PaymentMethodCard.propTypes = {
  onPress: PropTypes.func,
  cardType: PropTypes.oneOf(['debt', 'bank']).isRequired,
  onPressRemove: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.defaultRadius,
    backgroundColor: theme.white,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: 5,
  },
  textWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  rightContentStyle: {
    alignItems: 'flex-end',
    // flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },

  numberStyle: {
    marginTop: 5,
    backgroundColor: '#B6C0C9',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: 24,
    color: 'red',
    marginLeft: 10,
  },
  removeButtonStyle: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 5,
    backgroundColor: '#B31F31',
    borderColor: '#B31F31',
  },
  buttonTextStyle: {
    color: '#fff',
  },
});
