import {setUser} from '~/store/actions/AuthAction';
import {showLoader, hideLoader} from '~/store/actions/LoaderAction';
import * as api from '~/services/axios/Api';
import {navigate} from '../../navigation/RootNavigation';
import {
  NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN,
  NAVIGATION_TO_PHONE_VERIFICATION_CODE_SCREEN,
  SECONDARY_STACK,
} from '../../navigation/routes';
import {SIGNUP_POST_API_SUCCESS} from './constant/ActionTypes';

export const getCurrentUserSuccess = data => dispatch => {
  dispatch(
    setUser({
      user: data.sender,
      status: data.status,
    }),
  );
  setTimeout(() => {
    dispatch(hideLoader());
  }, 500);
};

export const getCurrentUser = navigation => (dispatch, getState) => {
  dispatch(showLoader());
  api
    .getCurrentUser()
    .then(response => {
      const status = response.data.status;
      if (!status.isPhoneNumberVerified) {
        const userData = getState().auth.user;
        dispatch({
          type: SIGNUP_POST_API_SUCCESS,
          payload: {...response.data, ...userData},
        });
        navigate(SECONDARY_STACK, {
          screen: NAVIGATION_TO_PHONE_VERIFICATION_CODE_SCREEN,
        });
      } else if (!status.isEmailVerified) {
        const userData = getState().auth.user;
        dispatch({
          type: SIGNUP_POST_API_SUCCESS,
          payload: {...response.data, ...userData},
        });
        navigate(SECONDARY_STACK, {
          screen: NAVIGATION_TO_EMAIL_VERIFICATION_CODE_SCREEN,
        });
      }
      dispatch(getCurrentUserSuccess(response.data));
    })
    .catch(error => {
      console.log('error', error);
      dispatch(hideLoader());
    });
};

export const syncUserSetting = () => async dispatch => {
  await api.syncSetting();
  await dispatch(getCurrentUser());
};
