import React, {Fragment} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MediumText, LightText} from '~/components/ui/Text';
import theme from '~/components/theme/Style';
import {DebitCardIcon, OnlineBankingIcon} from '~/components/ui/Icon';
import Card from './Card';
import {useNavigation, StackActions} from '@react-navigation/native';
import {layoutAnimation} from '~/presentation';

export default function SenderInformationCard({
  data,
  userInfo,
  paymentMethod,
  review,
}) {
  const navigation = useNavigation();
  const [toggle, setToggle] = React.useState(false);

  const onPressChangeCard = () => {
    const pushAction = StackActions.push('PayoutMethod', {
      routeFrom: 'review',
    });
    navigation.dispatch(pushAction);
  };

  const onPressToggle = () => {
    setToggle(!toggle);
    layoutAnimation();
  };

  const renderFundingSource = () => {
    return data?.fundingSource === 'BANK' ? (
      <Fragment>
        <OnlineBankingIcon />
        <LightText text={`${'   '}Bank Account`} style={styles.boldText} />
      </Fragment>
    ) : (
      <Fragment>
        <DebitCardIcon />
        <LightText text={`${'   '}Debit Card`} style={styles.boldText} />
      </Fragment>
    );
  };

  const renderFundingSourceDetails = () => {
    return data?.fundingSource === 'BANK' ? (
      <Fragment>
        <LightText
          text={data.bank?.name}
          style={[styles.boldText, styles.primaryText]}
        />
        <LightText text={'Account Holder'} style={styles.boldText} />
        <LightText
          text={data.bank?.accountHolderName}
          style={[styles.boldText, styles.primaryText]}
        />
      </Fragment>
    ) : (
      <Fragment>
        <LightText
          text={data.card?.fundingSourceName}
          style={[styles.boldText, styles.primaryText]}
        />
        <LightText text={'Nick Name'} style={styles.boldText} />
        <LightText
          text={data.card?.nickName}
          style={[styles.boldText, styles.primaryText]}
        />
      </Fragment>
    );
  };

  return (
    <Card title={'Sender Information'}>
      <View style={styles.topRow}>
        <View>
          <MediumText text={userInfo.fullName} style={styles.primaryText} />
          <LightText
            text={`${userInfo.address.state}, ${userInfo.address.country}`}
          />
        </View>
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
          <View style={styles.separator} />
          <MediumText text="Payment Method" style={styles.primaryText} />
          <View style={[styles.rowGroup, styles.separator]}>
            {renderFundingSource()}
            {review && (
              <TouchableOpacity onPress={onPressChangeCard}>
                <LightText
                  text={'change'}
                  style={[styles.redText, {marginHorizontal: 10}]}
                />
              </TouchableOpacity>
            )}
          </View>
          {review && <View>{renderFundingSourceDetails()}</View>}
        </Fragment>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
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
});
