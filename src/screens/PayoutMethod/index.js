import React, {useState} from 'react';
import {StyleSheet, FlatList, Alert} from 'react-native';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import theme from '~/components/theme/Style';
import {SemiBoldText, RegularText} from '~/components/ui/Text';
import ExpandableBlock from '~/components/ui/ExpandableBlock';
import {
  OnlineBankingIcon,
  Outline,
  DebitCardIcon,
  Done,
} from '~/components/ui/Icon';
import {OnlineBanking, DebitCard} from './container';
import {layoutAnimation} from '~/presentation';
import FooterButton from '~/components/ui/FooterButton';
import * as api from '~/services/axios/Api';
import {useDispatch, useSelector} from 'react-redux';
import {createTransactionData} from '~/store/actions/TransactionAction';
import {useFocusEffect} from '@react-navigation/native';
import widgetType from '~/constants/widgetType';
import {NAVIGTION_TO_WIDGETS_SCREEN} from '~/navigation/routes';
import {
  NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN,
  NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN,
} from '~/navigation/routes';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';

const BANK_ACCOUNT = 'BANK_ACCOUNT';
const DEBIT_CARD = 'DEBIT_CARD';

export default function AddBeneficiaryDetails({navigation, route}) {
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [onGoBack, setOnGoBack] = useState(false);
  const [type, setType] = useState('');
  const [selectedBank, setSelectedBank] = useState(undefined);
  const [selectedDebitCard, setSelectedDebitCard] = useState(undefined);
  const [review, setReview] = useState(route?.params?.routeFrom === 'review');
  let sendingAmountCard = transaction.destination?.sendingAmountLimit?.card;

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
    if (!loading) {
      if (route?.params?.routeFrom === 'review') {
        const filterSelectedBlock = selectedBlock
          ? selectedBlock
          : transaction.fundingSource === 'BANK'
          ? BANK_ACCOUNT
          : DEBIT_CARD;
        setSelectedBlock(filterSelectedBlock);
        if (filterSelectedBlock === BANK_ACCOUNT) {
          setSelectedBank(transaction.bank);
        } else {
          setSelectedDebitCard(transaction.card);
        }
      }
    }
    const reset = () => {
      onGoBack(false);
    };

    return () => reset;
  }, [loading]);

  useFocusEffect(
    React.useCallback(() => {
      setLoadingIndicator(true);
      const bankApi = api.getBanks();
      const cardApi = api.getCards();
      const unsubscribe = Promise.all([bankApi, cardApi]).then(values => {
        setBanks(values[0].data);
        setCards(values[1].data);
        setLoadingIndicator(false);
      });
      return () => unsubscribe;
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!loading && !review && onGoBack) {
        if (type === widgetType.bank) {
          setSelectedBank(banks?.result[0]);
        } else {
          setSelectedDebitCard(cards?.result[0]);
        }
      }
    }, [banks?.result, cards?.result, loading, onGoBack, review, type]),
  );

  const onChangeOnlineBanking = onlineBankingValue => {
    const findSelectedBank = banks.result.find(
      item => item.name === onlineBankingValue,
    );
    setSelectedBank(findSelectedBank);
  };

  const onChangeDebitCard = debitCardValue => {
    const findSelectedDebitCard = cards.result.find(
      item => `${item.nickName} ${item.fundingSourceName}` === debitCardValue,
    );
    setSelectedDebitCard(findSelectedDebitCard);
  };

  const onSelectBlock = value => {
    if (value === BANK_ACCOUNT) {
      setSelectedDebitCard(undefined);
    } else {
      setSelectedBank(undefined);
    }
    setSelectedBlock(value);
    layoutAnimation();
  };

  const renderBlockComponent = blockType => {
    var block = null;
    if (blockType === BANK_ACCOUNT) {
      block = (
        <OnlineBanking
          data={banks.result}
          extraData={selectedBank}
          pickerValue={'name'}
          onValueChange={onChangeOnlineBanking}
          value={selectedBank}
          default={!review}
          hasError={selectedBank?.verificationStatus === 'LOGIN_REQUIRED'}
          errorMessage={
            'Your bank credentials have changed. Please update your account credentials'
          }
          onNavigateWidget={onNavigateWidget}
        />
      );
    } else if (blockType === DEBIT_CARD) {
      let value =
        selectedDebitCard?.nickName === undefined
          ? ''
          : `${selectedDebitCard?.nickName} ${
              selectedDebitCard?.fundingSourceName
            }`;
      block = (
        <DebitCard
          sendingAmountCard={sendingAmountCard}
          data={cards.result}
          extraData={selectedDebitCard}
          // pickerValue={'nickName'}
          onValueChange={onChangeDebitCard}
          value={value}
          default={!review}
          senderAmount={transaction.senderAmount}
          hasError={selectedDebitCard?.verificationStatus === 'LOGIN_REQUIRED'}
          errorMessage={
            'Your card credentials have changed. Please update your account credentials'
          }
          onNavigateWidget={onNavigateWidget}
        />
      );
    }
    return block;
  };

  const renderReceiveMethod = ({item}) => {
    return selectedBlock === undefined ? (
      <ExpandableBlock
        onPress={() => onSelectBlock(item.fundingSource)}
        containerStyle={styles.blockContainer}
        leftContent={item.icon}
        title={item.title}
        caption={item.caption}
        rightContent={<Outline />}
      />
    ) : item.fundingSource === selectedBlock ? (
      <ExpandableBlock
        onPress={() => onSelectBlock(undefined)}
        containerStyle={styles.blockContainer}
        leftContent={item.icon}
        title={item.title}
        caption={item.caption}
        rightContent={<Done size={30} />}
        content={renderBlockComponent(item.fundingSource)}
      />
    ) : null;
  };

  /**
   * Calculate the fee FeeAmount and continue
   */
  const onPressContinue = () => {
    if (
      (selectedBank !== undefined && selectedBank.verificationStatus) ===
      'LOGIN_REQUIRED'
    ) {
      setType(widgetType.bank);
      navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
        widgetType: widgetType.bank,
        bankId: selectedBank.id,
      });
      return;
    }

    if (
      (selectedDebitCard !== undefined &&
        selectedDebitCard?.verificationStatus) === 'LOGIN_REQUIRED'
    ) {
      setType(widgetType.card);
      navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
        widgetType: widgetType.card,
        bankId: selectedDebitCard.id,
      });
      return;
    }

    if (selectedBank !== undefined || selectedDebitCard !== undefined) {
      const payoutMethod = transaction.payoutMethod;
      const paymentMethod = selectedBlock;
      var transactionDetails;
      if (selectedBlock === BANK_ACCOUNT) {
        transactionDetails = {
          paymentMethod,
          fundingSource: 'BANK',
          senderFundingAccountId: selectedBank.id,
          bank: selectedBank,
          card: '',
        };
      } else {
        transactionDetails = {
          paymentMethod,
          fundingSource: 'CARD',
          senderFundingAccountId: selectedDebitCard.id,
          card: selectedDebitCard,
          bank: '',
        };
      }
      dispatch(createTransactionData(transactionDetails));
      if (route?.params?.routeFrom === 'review') {
        navigation.navigate(NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN, {
          routeFrom: 'PayoutMethod',
        });
        return;
      }
      navigation.navigate(NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN, {
        routeFrom: 'PayoutMethod',
      });
    } else {
      Alert.alert('Please select Payment Method first!');
    }
  };

  const onPressBack = () => {
    navigation.goBack(NAVIGATION_TO_ADD_BENEFICIARY_DETAILS_SCREEN);
  };

  /**
   * disabled footer
   * bottom condition
   */
  const btnDisabled = React.useCallback(() => {
    let disabled = true;
    if (selectedBlock) {
      disabled = false;
    }
    if (
      (selectedBlock === DEBIT_CARD && !selectedDebitCard) ||
      (selectedBlock === BANK_ACCOUNT && !selectedBank)
    ) {
      disabled = true;
      return disabled;
    }
    if (
      selectedBlock === DEBIT_CARD &&
      transaction.senderAmount > sendingAmountCard
    ) {
      disabled = true;
      return disabled;
    }
    return disabled;
  }, [
    selectedBank,
    selectedBlock,
    selectedDebitCard,
    sendingAmountCard,
    transaction.senderAmount,
  ]);

  const onNavigateWidget = widgetValue => {
    setType(widgetValue);
    navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
      widgetType: widgetValue,
      onGoBack: (e, wType) => {
        // setType(wType);
        setReview(false);
        setOnGoBack(true);
      },
    });
  };

  return (
    <GenericView padding header={<Header title="Payment Method" />}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <React.Fragment>
            <SemiBoldText
              text="How would you want to pay for this transaction?"
              style={[styles.headerText]}
            />
            <RegularText
              text="Please Select Payment Method"
              style={[styles.boldText]}
            />
          </React.Fragment>
        }
        data={receiveMethod}
        renderItem={renderReceiveMethod}
        keyExtractor={item => item.title}
        ListFooterComponent={
          <React.Fragment>
            <FooterButton
              onPressBack={onPressBack}
              disabled={btnDisabled()}
              text="Continue"
              onPress={onPressContinue}
              style={styles.continueBtn}
            />
            {/* <PayoutInformation /> */}
          </React.Fragment>
        }
        ListFooterComponentStyle={styles.listFooterComponentStyle}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </GenericView>
  );
}

const receiveMethod = [
  {
    id: 1,
    fundingSource: BANK_ACCOUNT,
    icon: <OnlineBankingIcon />,
    title: 'Use Bank Account',
    caption: 'Your bank account will be charged',
    component: '',
  },
  {
    id: 2,
    fundingSource: DEBIT_CARD,
    icon: <DebitCardIcon />,
    title: 'Use Debit Card',
    caption: 'Your debit card will be charged',
  },
];

const styles = StyleSheet.create({
  headerText: {
    marginBottom: 15,
  },
  boldText: {
    fontWeight: '500',
    marginBottom: 8,
  },
  primaryText: {
    color: theme.primaryColor,
  },
  blockContainer: {
    marginVertical: 10,
  },
  continueBtn: {
    marginTop: 10,
  },
  contentContainerStyle: {
    minHeight: '100%',
    paddingBottom: 70,
  },
  listFooterComponentStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
