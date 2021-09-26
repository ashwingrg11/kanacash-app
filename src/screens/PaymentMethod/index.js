import React, {useState} from 'react';
import {FlatList, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Header from '~/components/ui/Header';
import GenericView from '~/components/ui/GenericView';
import Block from '~/components/ui/Block';
import {Plus} from '~/components/ui/Icon';
import PaymentMethodCard from '~/components/ui/PaymentMethodCard';
import theme from '~/components/theme/Style';
import widgetType from '~/constants/widgetType';
import * as api from '~/services/axios/Api';
import {NAVIGTION_TO_WIDGETS_SCREEN} from '../../navigation/routes';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';
import {showToast} from '~/store/actions/ToastAction';

const BANK = 'bank';
const CARD = 'debit card';

export default function PaymentMethod({navigation, route}) {
  const dispatch = useDispatch();
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(showLoader());
      const bankApi = api.getBanks();
      const cardApi = api.getCards();
      const unsubscribe = Promise.all([bankApi, cardApi]).then(values => {
        setBanks(values[0].data);
        setCards(values[1].data);
        dispatch(hideLoader());
      });
      return () => unsubscribe;
    }, []),
  );

  const onRemoveBank = bankId => {
    dispatch(showLoader());
    api
      .removeBank(bankId)
      .then(res => {
        dispatch(hideLoader());
        if (res.status === 200) {
          const filterBanks = banks.result.filter(item => item.id !== bankId);
          setBanks({
            ...banks,
            result: filterBanks,
          });
          dispatch(
            showToast({
              message: 'Your bank account has been successfully removed.',
              status: true,
            }),
          );
        } else {
          const msg = JSON.parse(res.data.message);
          dispatch(showToast({message: msg?.message, status: false}));
        }
      })
      .catch(err => {
        dispatch(hideLoader());
        const message = err?.data?.message
          ? JSON.parse(err.data.message)?.message
          : 'Error while removing bank';
        dispatch(showToast({message: message, status: false}));
      });
  };

  const onRemoveCard = cardId => {
    dispatch(showLoader());
    api
      .removeCard(cardId)
      .then(res => {
        dispatch(hideLoader());
        if (res.status === 200) {
          const filterCards = cards.result.filter(item => item.id !== cardId);
          setCards({
            ...cards,
            result: filterCards,
          });
          dispatch(
            showToast({
              message: 'Your card has been successfully removed.',
              status: true,
            }),
          );
        } else {
          const msg = JSON.parse(res.data.message);
          dispatch(showToast({message: msg?.message, status: false}));
        }
      })
      .catch(err => {
        dispatch(hideLoader());
        const message = err?.data?.message
          ? JSON.parse(err.data.message)?.message
          : 'Error while removing debit card';
        dispatch(showToast({message: message, status: false}));
      });
  };

  const askUserBeforeDelete = (type, item) => {
    const name = type === BANK ? item.accountHolderName : item.nickName;
    Alert.alert(
      'Are you sure?',
      `Delete ${name} ${type}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            type === BANK ? onRemoveBank(item.id) : onRemoveCard(item.id),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const onPressAddCard = cardId => {
    navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
      widgetType: widgetType.card,
      cardId: cardId,
    });
  };

  const onPressAddBank = bankId => {
    navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
      widgetType: widgetType.bank,
      bankId: bankId,
    });
  };

  const renderBanks = ({item, index}) => {
    return (
      <PaymentMethodCard
        cardType="bank"
        num={index + 1}
        title={item.name}
        first={item.accountHolderName}
        second={item.accountType}
        verificationStatus={item.verificationStatus}
        onPressRemove={() => askUserBeforeDelete(BANK, item)}
        onPressRefresh={() => onPressAddBank(item.id)}
      />
    );
  };

  const renderCards = ({item, index}) => {
    return (
      <PaymentMethodCard
        cardType="debt"
        num={index + 1}
        title={item.fundingSourceName}
        first={item.nickName}
        second={item.institutionName}
        verificationStatus={item.verificationStatus}
        onPressRemove={() => askUserBeforeDelete(CARD, item)}
        onPressRefresh={onPressAddCard}
      />
    );
  };

  return (
    <GenericView
      header={<Header title={'Payment Method'} />}
      padding
      scrollable>
      <Block
        onPress={() => onPressAddBank()}
        title="Add bank"
        rightContent={<Plus />}
        primary
      />
      <FlatList
        data={banks.result}
        renderItem={renderBanks}
        keyExtractor={item => item.id}
      />

      <Block
        onPress={() => onPressAddCard()}
        title="Add Debit Card"
        rightContent={<Plus />}
        backgroundColor={theme.red}
      />
      <FlatList
        data={cards.result}
        renderItem={renderCards}
        keyExtractor={item => item.id}
      />
    </GenericView>
  );
}
