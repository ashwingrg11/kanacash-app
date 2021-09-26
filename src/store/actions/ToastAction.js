import {SHOW_TOAST, HIDE_TOAST} from '~/store/actions/constant/ActionTypes';

var timer;

export const hideToast = () => dispatch => {
  dispatch({
    type: HIDE_TOAST,
  });
  clearTimeout(timer);
};

export const showToast = toastPayload => dispatch => {
  dispatch({
    type: SHOW_TOAST,
    payload: toastPayload,
  });
  timer = setTimeout(() => {
    dispatch(hideToast());
  }, 4000);
};
