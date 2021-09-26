import React, {Fragment} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MediumText, LightText} from '~/components/ui/Text';
import theme from '~/components/theme/Style';
// import {DebitCardIcon} from '~/components/ui/Icon';
import Card from './Card';
import {useNavigation, StackActions} from '@react-navigation/native';
import {layoutAnimation} from '~/presentation';
// import {
//   CASH_PICKUP,
//   BANK_DEPOSIT,
//   HOME_DELIVERY,
//   WALLET,
// } from '../../../constants/addReceiverDetail';

export default function SenderInformationCard({data, review}) {
  const navigation = useNavigation();
  const [toggle, setToggle] = React.useState(false);

  const beneficiary = data.beneficiary;
  // const payer = data.payer;
  // const bank = data.BeneficiaryBank;

  const onPressChangeCard = () => {
    const pushAction = StackActions.push('AddBeneficiaryDetails', {
      routeFrom: 'review',
    });
    navigation.dispatch(pushAction);
  };

  const onPressToggle = () => {
    setToggle(!toggle);
    layoutAnimation();
  };

  const renderIcon = key => {
    let icon;
    switch (key) {
      case 'CASH_PICKUP':
        icon = <Icon name="md-cash" size={24} />;
        break;
      case 'BANK_DEPOSIT':
        icon = <Icon name="md-business" size={24} />;
        break;
      case 'HOME_DELIVERY':
        icon = <Icon name="md-home" size={24} />;
        break;
      case 'WALLET':
        icon = <Icon name="md-folder" size={24} />;
        break;
      default:
        icon = <Icon name="md-cash" size={24} />;
        break;
    }
    return icon;
  };

  return (
    <Card title={'Recipient Information'}>
      <View style={styles.topView}>
        <MediumText text={beneficiary.fullName} style={styles.primaryText} />
        <TouchableOpacity onPress={onPressToggle}>
          {toggle ? (
            <Icon name="md-remove-circle-outline" size={24} />
          ) : (
            <Icon name="md-add-circle-outline" size={24} />
          )}
        </TouchableOpacity>
      </View>
      {toggle && (
        <Fragment>
          <LightText
            text={`${beneficiary?.address.city}, ${
              beneficiary?.address.country
            }`}
          />
          <View style={styles.separator} />
          <MediumText text="Payout Method" style={styles.primaryText} />
          <View style={[styles.rowGroup, styles.separator]}>
            {renderIcon(data.payoutMethod)}
            <LightText
              text={` ${data.payoutMethod.replace('_', ' ')}`}
              style={[styles.boldText, styles.marginLeft]}
            />
            {review && (
              <TouchableOpacity onPress={onPressChangeCard}>
                <LightText
                  text={'change'}
                  style={[styles.redText, {marginHorizontal: 10}]}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* {Object.entries(payer).length !== 0 ? (
            <PayerCard data={payer} />
          ) : null}
          {Object.entries(bank).length !== 0 ? <BankCard data={bank} /> : null} */}
        </Fragment>
      )}
    </Card>
  );
}

const PayerCard = ({data}) => {
  return (
    <View>
      <LightText text={data.name} style={styles.boldText} />
      <LightText text={`${data.address}, ${data.country}`} />
      <View style={styles.rowGroup}>
        <LightText
          text="Branch Code: "
          style={[styles.primaryText, styles.boldText]}
        />
        <LightText text={data.code} />
      </View>
    </View>
  );
};

const BankCard = ({data}) => {
  return (
    <View>
      {/* <View style={[styles.rowGroup, styles.seperator]}>
        <DebitCardIcon />
        <LightText text="  Debit Card" style={styles.boldText} />
      </View> */}
      <LightText text={data.bankName} style={styles.boldText} />
      <View style={styles.rowGroup}>
        <LightText
          text="Account Number: "
          style={[styles.primaryText, styles.boldText]}
        />
        <LightText text={data.accountNumber} />
      </View>
      <View style={styles.rowGroup}>
        <LightText
          text="Account Type: "
          style={[styles.primaryText, styles.boldText]}
        />
        <LightText text={data.accountType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryText: {color: theme.primaryColor},
  separator: {marginVertical: 10},
  rowGroup: {flexDirection: 'row', alignItems: 'center'},
  boldText: {fontWeight: 'bold'},
  redText: {
    color: theme.red,
    fontWeight: 'bold',
    lineHeight: 27,
  },
  marginLeft: {
    marginLeft: 5,
  },
});
