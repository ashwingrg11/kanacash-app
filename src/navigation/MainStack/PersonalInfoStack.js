import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  PersonalInformationScreen,
  CreateBeneficiaryScreen,
  BeneficiarySuccessScreen,
  AddReceiveMethodScreen,
} from '~/screens/';

import {
  NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN,
  NAVIGATION_TO_BENEFICIARY_SCREEN,
  NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN,
  NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN,
  NAVIGATION_TO_PERSONAL_INFORMATION_SCREEN,
} from '../routes';

const PersonalInfo = createStackNavigator();

const PersonalInfoStackNavigation = () => (
  <PersonalInfo.Navigator headerMode="none">
    <PersonalInfo.Screen
      name={NAVIGATION_TO_PERSONAL_INFORMATION_SCREEN}
      component={PersonalInformationScreen}
    />
    <PersonalInfo.Screen
      name={NAVIGATION_TO_CREATE_BENEFICIARY_SCREEN}
      component={CreateBeneficiaryScreen}
    />
    <PersonalInfo.Screen
      name={NAVIGATION_TO_BENEFICIARY_SCREEN}
      component={CreateBeneficiaryScreen}
    />
    <PersonalInfo.Screen
      name={NAVIGATION_TO_BENEFICIARY_SUCCESS_SCREEN}
      component={BeneficiarySuccessScreen}
    />
    <PersonalInfo.Screen
      name={NAVIGATION_TO_ADD_RECEIVE_METHOD_SCREEN}
      component={AddReceiveMethodScreen}
    />
  </PersonalInfo.Navigator>
);

export default PersonalInfoStackNavigation;
