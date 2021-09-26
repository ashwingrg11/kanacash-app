import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import scrollPersistTaps from './scrollPersistTaps';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class KeyboardView extends React.PureComponent {
  static propTypes = {
    style: PropTypes.any,
    contentContainerStyle: PropTypes.any,
    keyboardVerticalOffset: PropTypes.number,
    scrollEnabled: PropTypes.bool,
  };

  render() {
    const {
      style,
      contentContainerStyle,
      scrollEnabled,
      keyboardVerticalOffset,
      children,
    } = this.props;

    return (
      <KeyboardAwareScrollView
        {...scrollPersistTaps}
        style={[styles.mainContainer, style]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        scrollEnabled={scrollEnabled}
        alwaysBounceVertical={true}
        extraHeight={keyboardVerticalOffset}
        behavior="vertical">
        {children}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFF',
  },
});
