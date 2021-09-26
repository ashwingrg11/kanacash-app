import {SET_SUCCESS} from '~/store/actions/constant/ActionTypes.js';

import {Platform} from 'react-native';

import {showModal} from '~/store/actions/Modal';

export const setSuccess = success => dispatch => {
  const payload = {...success, type: 'success'};
  dispatch({
    type: SET_SUCCESS,
    payload: payload,
  });

  if (Platform.OS === 'ios') {
    setTimeout(() => {
      dispatch(showModal(payload));
    }, 300);
  } else {
    dispatch(showModal(payload));
  }
};
