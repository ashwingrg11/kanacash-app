import React from 'react';
import {View, StyleSheet, TextInput, Platform} from 'react-native';
import {RegularText} from '~/components/ui/Text';
import theme from '~/components/theme/Style';
import PickerModal from './Picker';

export default function AmountBlock({
  label,
  data,
  value,
  onChangeText,
  editable,
  error,
  ...pickerAttributes
}) {
  return (
    <View>
      <RegularText text={label} style={styles.labelText} />
      <View style={styles.blockWrapper(error)}>
        <TextInput
          placeholder="1000.00"
          style={styles.textInputStyle(error)}
          value={isNaN(value) ? 0 : value.toString()}
          onChangeText={onChangeText}
          keyboardType="numeric"
          editable={editable}
        />
        <PickerModal
          {...pickerAttributes}
          pickOptions={data}
          placeholder="Select"
          inputParentStyles={styles.inputParentStyles}
          containerStyle={styles.containerStyle}
          placeholderStyle={styles.placeholderStyle}
          androidIconStyle={styles.iconStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontWeight: '700',
    marginBottom: 10,
  },
  blockWrapper: error => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: theme.defaultRadius,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: error ? theme.red : '#B6C0C9',
  }),
  textInputStyle: error => ({
    flex: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: error ? theme.red : theme.fontColor,
    fontFamily: theme.inputFont,
  }),
  inputParentStyles: {
    ...Platform.select({
      ios: {
        flex: 2,
      },
      android: {
        flex: 2.2,
      },
    }),
  },
  containerStyle: {
    backgroundColor: theme.secondaryColor,
  },
  placeholderStyle: {
    color: '#fff',
  },
  iconStyle: {
    color: '#fff',
  },
});
