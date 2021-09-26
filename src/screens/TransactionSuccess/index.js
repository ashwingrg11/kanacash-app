import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearTransactionData} from '~/store/actions/TransactionAction';
import {BoldText, RegularText} from '~/components/ui/Text';
import Button from '~/components/ui/Button';
import theme from '~/components/theme/Style';
import {ThumbsUp} from '~/components/ui/Image';
import GenericView from '~/components/ui/GenericView';
import {NAVIGATION_TO_DASHBOARD_SCREEN} from '../../navigation/routes';
import Header from '~/components/ui/Header';

export default function TransactionSuccess({navigation}) {
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction);

  const onPressContinue = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        key: null,
        routes: [{name: NAVIGATION_TO_DASHBOARD_SCREEN}],
      }),
    );
    dispatch(clearTransactionData());
  };

  return (
    <GenericView header={<Header />}>
      <View style={styles.containerStyle}>
        <ThumbsUp />
        <BoldText text={'Congratulations!'} style={styles.titleText} />
        <RegularText
          style={[styles.textCenter]}
          text="Your money transfer is on its way to"
        />
        <BoldText
          style={[styles.textCenter]}
          text={transaction.beneficiary?.fullName}
        />
        <View style={styles.box}>
          <Icon name={'md-warning'} size={18} color="#155724" />
          <RegularText
            style={[styles.textCenter]}
            text="Beneficiary will be notified via SMS when the transaction has been delivered."
          />
        </View>
        <RegularText
          style={[styles.textCenter, styles.bottomText]}
          text="Please go to your dashboard to view your receipt and other details. We will send you an email with your receipt and notification after the transaction is delivered."
        />
        <Button
          text={'Back to Dashboard'}
          onPress={onPressContinue}
          style={[styles.loginBtn]}
        />
      </View>
    </GenericView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    marginVertical: 10,
    color: theme.red,
  },
  descriptionText: {
    marginBottom: 25,
    textAlign: 'center',
  },
  textCenter: {
    marginLeft: 5,
    textAlign: 'center',
    color: '#155724',
  },
  blueText: {
    color: theme.primaryColor,
  },
  loginBtn: {},
  bottomText: {
    margin: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: 'rgba(85,236,66,.16)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
