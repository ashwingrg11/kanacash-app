import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {hideToast} from '../../store/actions/ToastAction';

const ICON_SIZE = 30;
export default function ToastMessage() {
  const dispatch = useDispatch();
  const {status, message} = useSelector(state => state.toast);
  return (
    <View style={[styles.container]}>
      <View style={styles.closeIcon}>
        <TouchableOpacity onPress={() => dispatch(hideToast())}>
          <Icon
            name="md-close"
            size={20}
            color={!status ? '#856404' : '#FFF'}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[styles.innerContainer, status ? styles.success : styles.fail]}>
        {status ? (
          <MaterialIcons name="check-circle" size={ICON_SIZE} color={'#fff'} />
        ) : (
          <Icon name="md-warning" size={ICON_SIZE} color={'#856404'} />
        )}
        <Text
          style={[
            styles.textMessage,
            status ? styles.successText : styles.failText,
          ]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  success: {
    backgroundColor: '#28a745',
  },
  fail: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
  },
  container: {
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: 20,
  },
  innerContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMessage: {
    marginLeft: 10,
    marginRight: 15,
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  successText: {
    color: '#fff',
  },
  failText: {
    color: '#856404',
  },
  closeIcon: {
    position: 'absolute',
    top: '2%',
    left: '94%',
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
