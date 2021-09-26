import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  SemiBoldText,
  BoldText,
  LightText,
  MediumText,
} from '~/components/ui/Text';
import {Number} from '~/components/ui/Icon';
import theme from '~/components/theme/Style';
import TransactionBlock from '~/components/ui/TransactionBlock';
import * as api from '~/services/axios/Api';
import {
  createTransactionData,
  clearTransactionData,
} from '~/store/actions/TransactionAction';
import {NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN} from '../../../navigation/routes';
import abbreviateNumber from '~/utils/abbreviateNumber';
import moment from 'moment';
import {statusStyle} from '~/utils/checkTransactionStatus';

export default function TransactionList({
  renderTotal,
  onChangeTransactionList,
  ...attributes
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [transactionList, setTransactionList] = useState([]);
  const [transactionLimit, setTransactionLimit] = useState(undefined);
  // pagination
  const [page, setPage] = useState(0);
  const [nextPage, setNextPage] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      !nextPage && setNextPage(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      let unsubscribe = () => {};
      if (renderTotal) {
        setPageLoading(true);
        unsubscribe = () => {
          // api.getGlance().then(res => setGlance(res.data));
          api.transactionLimit().then(res => setTransactionLimit(res.data));
        };
      }
      unsubscribe();
      return () => unsubscribe;
    }, [renderTotal]),
  );

  useEffect(() => {
    onChangeTransactionList &&
      onChangeTransactionList(transactionList.length, isFetching);
  }, [transactionList.length, isFetching, onChangeTransactionList]);

  useFocusEffect(
    React.useCallback(() => {
      if (page === 0) {
        setTransactionList([]);
      }
      let isActive = true;
      if (isActive && nextPage) {
        setPageLoading(true);
        const params = {
          page: page,
          pageSize: 20,
        };
        api
          .getTransaction(params)
          .then(res => {
            if (res.data.result.length === 0) {
              setNextPage(false);
            }
            setTransactionList(prevState => [...prevState, ...res.data.result]);
            setPageLoading(false);
            setIsFetching(false);
          })
          .catch(() => {
            setTransactionList({result: []});
            setPageLoading(false);
            setIsFetching(false);
          });
      }
      return () => (isActive = false);
    }, [nextPage, page]),
  );

  const onEndReached = () => {
    !pageLoading && nextPage && setPage(prevCount => prevCount + 1);
  };

  const onPressBlock = item => {
    dispatch(clearTransactionData());
    dispatch(createTransactionData(item));
    navigation.navigate(NAVIGATION_TO_TRANSACTION_DETAILS_SCREEN);
  };

  const renderTransaction = ({item, index}) => {
    const modifiedDate = moment(new Date(item.createdAt)).format('MM/DD/yyyy');

    return (
      <TransactionBlock
        onPress={() => onPressBlock(item)}
        leftContent={<Number num={index + 1} invert />}
        rightContent={
          <View style={styles.blockRightContentStyle}>
            <MediumText text={`$${abbreviateNumber(item.senderAmount)}`} />
            <LightText text={modifiedDate} numberOfLines={1} />
          </View>
        }
        // statusColor={statusStyle(checkTransactionStatus(item))}
        statusColor={statusStyle(item.status)}
        // status={checkTransactionStatus(item)}
        status={item.status}
        title={item.beneficiary.fullName}
        caption={item.referenceNumber}
      />
    );
  };

  const onRefresh = () => {
    setIsFetching(true);
    setTransactionList([]);
    setPage(0);
    setNextPage(true);
    setPageLoading(true);
  };

  return (
    <View style={styles.container}>
      {renderTotal && (
        <View style={styles.amountWrapper}>
          <BoldText
            text={`${transactionLimit ? transactionLimit.senderLimit : 0} USD`}
            style={[styles.amountText]}
          />
          <SemiBoldText text={'Transaction Limit'} />
        </View>
      )}
      <FlatList
        onRefresh={onRefresh}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        data={transactionList}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => item.referenceId.toString() + index}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListFooterComponent={
          !isFetching && nextPage ? (
            <ActivityIndicator
              style={styles.indicator}
              animating={nextPage}
              size="small"
              color="green"
            />
          ) : (
            <></>
          )
        }
        ListEmptyComponent={
          !pageLoading ? (
            <View style={styles.listEmptyComponentStyle}>
              <Text style={styles.emptyStateText}>
                <Text style={styles.bold}>No transactions. </Text>
                <Text>
                  You currently have no transactions. Once you make a transfer,
                  it will show up here.
                </Text>
              </Text>
            </View>
          ) : (
            <></>
          )
        }
        {...attributes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  amountWrapper: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  listHeaderComponentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerText: {
    color: theme.red,
  },
  blockRightContentStyle: {alignItems: 'flex-end'},
  listEmptyComponentStyle: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: theme.themeFontRegular,
    fontSize: theme.fontSizeRegular,
    lineHeight: 20,
    color: theme.fontColor,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  indicator: {marginVertical: 10},
});
