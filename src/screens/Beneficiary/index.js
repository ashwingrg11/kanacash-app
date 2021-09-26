import React from 'react';
import {StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import {MediumText} from '~/components/ui/Text';
import Block from '~/components/ui/Block';
import {Plus} from '~/components/ui/Icon';
import BeneficiaryCard from '~/components/ui/BeneficiaryCard';
import {FlatList} from 'react-native';
import * as api from '~/services/axios/Api';
import {NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN} from '../../navigation/routes';
import PayoutModal from './container/PayoutModal';
import {hideLoader, showLoader} from '~/store/actions/LoaderAction';

const EmptyState = () => {
  return (
    <MediumText
      text=" You currently have no Beneficiary. Once you add beneficiary, it will show up here."
      style={styles.emptyState}
    />
  );
};

export default function BeneficiaryScreen({navigation}) {
  const dispatch = useDispatch();
  const [beneficiaries, setBeneficiaries] = React.useState(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  const memoizedCallback = React.useCallback(() => {
    dispatch(showLoader());
    api
      .getBeneficiaries()
      .then(res => {
        dispatch(hideLoader());
        setBeneficiaries(res.data);
      })
      .catch(() => {
        dispatch(hideLoader());
      });
  }, []);

  useFocusEffect(memoizedCallback);

  const onSuccessAddBeneficiaryBank = () => {
    setModalVisible(false);
    memoizedCallback();
  };

  const renderBeneficiary = ({item}) => {
    return (
      <React.Fragment>
        <BeneficiaryCard
          item={item}
          onPressAddPayoutMethod={() => setModalVisible(item.referenceId)}
          onPressEdit={() =>
            navigation.navigate(NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN, {
              update: item,
            })
          }
        />
        {modalVisible === item.referenceId && (
          <PayoutModal
            onPressBack={() => setModalVisible(false)}
            onSuccessAddBeneficiaryBank={onSuccessAddBeneficiaryBank}
            id={item.referenceId}
            data={item}
            visible={modalVisible === item.referenceId ? true : false}
            onRequestClose={() => setModalVisible('')}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <GenericView padding header={<Header title={'Beneficiary'} />}>
      <Block
        onPress={() =>
          navigation.navigate(NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN, {
            update: false,
          })
        }
        title="Add New Beneficiary"
        rightContent={<Plus />}
        primary
      />

      {beneficiaries !== undefined && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={beneficiaries.result}
          renderItem={renderBeneficiary}
          ListEmptyComponent={<EmptyState />}
          keyExtractor={(item, index) => `${item.firstName}-${index}`}
        />
      )}
    </GenericView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    textAlign: 'center',
  },
});
