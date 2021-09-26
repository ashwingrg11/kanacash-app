/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, Platform, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import SInfo from 'react-native-sensitive-info';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import AlertModal from '~/components/ui/Modal';
import Loader from '~/components/ui/Loader';
import GenericView from '~/components/ui/GenericView';
import ToastMessage from '~/components/ui/ToastMessage';
import {navigationRef} from '~/navigation/RootNavigation';
import BackgroundTimer from 'react-native-background-timer';
// app navigator
import AuthNavigator from '~/navigation/AuthNavigator/';
import DrawerNavigator from '~/navigation/MainStack/';
//storage
import config from '~/constants/config';
import createStore from '~/store/Store';
import {resetAuth} from '~/store/actions/AuthAction';
import {hideLoader} from './src/store/actions/LoaderAction';

const {store} = createStore();

const MINUTES_INTO_MILLIE_SECOND = 1200000;
var timer;

const App: () => React$Node = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isLoading = useSelector(state => state.loader.presentLoader);
  const showModal = useSelector(state => state.modal.presentModal);
  const showToast = useSelector(state => state.toast.showToast);
  // const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    SplashScreen.hide();
    if (!isAuthenticated) {
      clearStorage();
      console.log('clearStorage', clearStorage);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      timer = setTimeout(function() {
        dispatch(hideLoader());
      }, 20000);
    } else {
      clearTimeout(timer);
    }
  }, [dispatch, isLoading]);

  const clearStorage = () => {
    store.dispatch(resetAuth());
    AsyncStorage.clear();
    SInfo.deleteItem(config.accessToken, {
      sharedPreferencesName: config.sharedPreferencesName,
      keychainService: config.keychainService,
    });
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChangeIos = (nextAppState: any) => {
    if (nextAppState === 'inactive') {
      BackgroundTimer.start();
      BackgroundTimer.runBackgroundTimer(() => {
        clearStorage();
        BackgroundTimer.stopBackgroundTimer();
        BackgroundTimer.stop();
        RNRestart.Restart();
      }, MINUTES_INTO_MILLIE_SECOND);
    } else if (nextAppState === 'active') {
      BackgroundTimer.stopBackgroundTimer();
      BackgroundTimer.stop();
    }
  };

  const handleAppStateChangeAndroid = (nextAppState: any) => {
    if (nextAppState === 'background') {
      BackgroundTimer.runBackgroundTimer(() => {
        clearStorage();
        BackgroundTimer.stopBackgroundTimer();
        RNRestart.Restart();
      }, 1200000);
    } else if (nextAppState === 'active') {
      BackgroundTimer.stopBackgroundTimer();
    }
  };

  const handleAppStateChange = (nextAppState: any) => {
    Platform.OS === 'ios'
      ? handleAppStateChangeIos(nextAppState)
      : handleAppStateChangeAndroid(nextAppState);
  };

  return (
    <GenericView>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle={'default'} animated />
        {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
        {showModal ? <AlertModal /> : null}
        {isLoading ? <Loader /> : null}
        {showToast && <ToastMessage />}
      </NavigationContainer>
    </GenericView>
  );
};

export default App;
