import React, {useState, useEffect} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {SvgCssUri} from 'react-native-svg';
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ShadowView from 'react-native-simple-shadow-view';
import {RegularText} from '~/components/ui/Text';
import themeStyle from '~/components/theme/Style';
import theme from '~/components/theme/Style';

PickerModal.defaultProps = {
  pickerValue: 'name',
  onValueChange: () => {},
  default: true,
  onPressEmptyPicker: () => {},
};

PickerModal.propTypes = {
  onValueChange: PropTypes.func.isRequired,
};

export default function PickerModal(props) {
  const [selectedValue, setSelectedValue] = useState('');

  React.useEffect(() => {
    if (props.value) {
      setSelectedValue(props.value[props.pickerValue]);
    }
    if (props.selectedValue) {
      setSelectedValue(props.selectedValue);
    } else if (props.selectedValue === '') {
      setSelectedValue('');
    }
  }, [props.value, props.selectedValue, props.pickerValue]);

  // if default the selected value will be first index of array
  useEffect(() => {
    if (Platform === 'android' || props.default) {
      if (props.pickOptions.length !== 0) {
        const getFirstIndex = props.pickOptions[0][props.pickerValue];
        setSelectedValue(getFirstIndex);
        props.onValueChange(getFirstIndex);
      }
    }
  }, [props.pickOptions]);

  const items = props.pickOptions.map((item, id) => (
    <Picker.Item
      key={id}
      label={item[props.pickerValue]}
      value={item[props.pickerValue]}
    />
  ));

  const getImageUrl = React.useCallback(() => {
    if (props.pickOptions) {
      const findImage = props.pickOptions.find(
        item => item[props.pickerValue] === selectedValue,
      );
      return findImage?.flagUrl;
    } else {
      return '';
    }
  }, [props.pickOptions, selectedValue]);

  const onPressTouchable = () => {
    if (props.pickOptions.length >= 1) {
    } else {
      props.onPressEmptyPicker && props.onPressEmptyPicker();
    }
  };

  return (
    <View style={[styles.container, props.inputParentStyles]}>
      {props.label && (
        <RegularText text={props.label} style={styles.labelStyle} />
      )}
      <TouchableWithoutFeedback
        disabled={props.disabled}
        onPress={onPressTouchable}>
        <ShadowView
          style={[
            styles.shadowViewStyle(props.hasError),
            props.containerStyle && props.containerStyle,
          ]}>
          {props.flag && (
            <View style={styles.flagWrapperAndroid}>
              <SvgCssUri width="40" height="40" uri={getImageUrl()} />
            </View>
          )}
          <Icon
            name="arrow-down"
            size={12}
            style={[
              styles.androidPickerIcon,
              props.placeholderStyle && props.placeholderStyle,
            ]}
          />
          <Picker
            // prompt={props.label}
            // mode="dialog"
            enabled={props.pickOptions.length !== 0 && !props.disabled}
            onValueChange={(itemValue, itemPosition) => {
              if (!itemValue) {
                return;
              }
              setSelectedValue(itemValue);
              props.onValueChange(itemValue);
            }}
            selectedValue={selectedValue}
            style={[
              styles.androidPickerStyle,
              props.placeholderStyle && props.placeholderStyle,
            ]}>
            <Picker.Item label="Please select an option" key={'unselectable'} />
            {items}
          </Picker>
        </ShadowView>
      </TouchableWithoutFeedback>

      {props.hasError && props.errorMessage ? (
        <RegularText text={props.errorMessage} style={styles.errorMsg} />
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  shadowViewStyle: hasError => ({
    borderRadius: 5,
    backgroundColor: themeStyle.white,
    borderWidth: 1,
    borderColor: hasError ? '#FF0000' : '#d3d3d3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowRadius: hasError ? 0 : 5,
      },
      android: {},
    }),
  }),
  placeholderStyle: {
    fontFamily: themeStyle.fontRegular,
    fontSize: themeStyle.fontSizeRegular,
    color: themeStyle.fontColor,
    marginHorizontal: 5,
  },
  androidPickerStyle: {
    width: '100%',
    fontFamily: themeStyle.fontRegular,
    fontSize: themeStyle.fontSizeRegular,
    backgroundColor: 'transparent',
    lineHeight: 16,
    color: themeStyle.fontColor,
  },

  labelStyle: {
    marginBottom: 10,
  },
  androidPickerIcon: {
    color: '#000',
    position: 'absolute',
    alignItems: 'center',
    right: 10,
  },
  flagWrapperAndroid: {
    height: 30,
    width: 30,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMsg: {
    marginTop: 5,
    color: theme.red,
  },
});
