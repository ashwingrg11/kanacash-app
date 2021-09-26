import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ErrorMessage({msg, type = 'error'}) {
  return (
    <View
      style={[
        styles.container,
        type === 'error'
          ? styles.containerErrorBackgroundColor
          : styles.containerWarningBackgroundColor,
      ]}>
      <Icon
        name="md-warning"
        size={24}
        color={type === 'error' ? 'rgb(114, 28, 36)' : '#856404'}
      />
      <Text style={type === 'error' ? styles.errorStyle : styles.warningStyle}>
        {msg}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 12,
  },
  containerErrorBackgroundColor: {
    backgroundColor: 'rgba(255,0,0,.27)',
  },
  containerWarningBackgroundColor: {
    backgroundColor: '#fff3cd',
  },
  errorStyle: {
    fontSize: 15,
    marginLeft: 10,
    color: '#8b0000',
    flex: 1,
  },
  warningStyle: {
    fontSize: 15,
    marginLeft: 10,
    color: '#666600',
    flex: 1,
  },
});
