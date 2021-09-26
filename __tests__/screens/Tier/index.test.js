import 'react-native';
import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import Tier from '~/screens/Tier/';
import Store from '~/store/Store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<Tier />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SafeAreaProvider store={Store}>
          <Tier />
        </SafeAreaProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
