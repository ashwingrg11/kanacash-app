import 'react-native';
import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import PhoneVerifiedScreen from '~/screens/PhoneVerified/';
import Store from '~/store/Store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<PhoneVerifiedScreen />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SafeAreaProvider store={Store}>
          <PhoneVerifiedScreen />
        </SafeAreaProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
