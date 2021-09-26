import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RegularText} from '~/components/ui/Text';
import theme from '~/components/theme/Style';
import PickerModal from '~/components/ui/PickerModal';
import AddNewCard from './AddNewCard';
import Box from './Box';
import {useNavigation} from '@react-navigation/native';
import widgetType from '~/constants/widgetType';
import {NAVIGTION_TO_WIDGETS_SCREEN} from '../../../navigation/routes';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import CustomPicker from './CustomDebitCardPicker';

export default function DebitCard({
  data,
  extraData,
  pickerValue,
  onValueChange,
  senderAmount,
  sendingAmountCard,
  onNavigateWidget,
  ...pickerProps
}) {
  const navigation = useNavigation();

  const navigateToCardWidget = () => {
    navigation.navigate(NAVIGTION_TO_WIDGETS_SCREEN, {
      widgetType: widgetType.card,
    });
  };

  return (
    <View style={styles.container}>
      {senderAmount > sendingAmountCard ? (
        <ErrorMessage
          type="warning"
          msg={`Transaction above $${sendingAmountCard} cannot be made using debit card`}
        />
      ) : (
        <View>
          <RegularText
            text={'Select from added debit cards'}
            style={styles.headerText}
          />
          <CustomPicker
            onPressEmptyPicker={() => onNavigateWidget(widgetType.card)}
            label="Select"
            pickOptions={data}
            placeholder="Select"
            // pickerValue={pickerValue}
            onValueChange={onValueChange}
            inputParentStyles={styles.inputParentStyle}
            {...pickerProps}
          />
          {extraData ? (
            <Box
              titleFirst="Nick Name"
              titleSecond="Card"
              titleThird="Network"
              first={extraData.nickName}
              second={extraData.fundingSourceName}
              third={extraData.institutionName}
            />
          ) : (
            <></>
          )}
          <AddNewCard
            text={'add a new debit card'}
            onPress={() => onNavigateWidget(widgetType.card)}
          />
        </View>
      )}
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
