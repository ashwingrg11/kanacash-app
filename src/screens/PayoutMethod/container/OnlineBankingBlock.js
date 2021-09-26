import React from 'react';
import {View, StyleSheet} from 'react-native';
import theme from '~/components/theme/Style';
import PickerModal from '~/components/ui/PickerModal';
import AddNewCard from './AddNewCard';
import Box from './Box';
import widgetType from '~/constants/widgetType';

export default function OnlineBanking({
  data,
  extraData,
  pickerValue,
  onValueChange,
  onNavigateWidget,
  ...pickerProps
}) {
  return (
    <View style={styles.container}>
      <PickerModal
        onPressEmptyPicker={() => onNavigateWidget(widgetType.bank)}
        label="Select Bank"
        pickOptions={data}
        placeholder="Select"
        pickerValue={pickerValue}
        onValueChange={onValueChange}
        inputParentStyles={styles.inputParentStyle}
        {...pickerProps}
      />
      {extraData ? (
        <Box
          titleFirst="Bank"
          titleSecond="Account Holder"
          titleThird="Account Type"
          first={extraData.name}
          second={extraData.accountHolderName}
          third={extraData.accountType}
        />
      ) : (
        <></>
      )}
      <AddNewCard
        routeName={'AddBank'}
        text="add a new bank"
        onPress={() => onNavigateWidget(widgetType.bank)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputParentStyle: {
    marginBottom: 20,
  },
  headerText: {
    color: theme.primaryColor,
    fontWeight: '500',
    marginBottom: 20,
  },
});
