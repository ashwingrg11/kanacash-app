import {SHOW_TOAST, HIDE_TOAST} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
  showToast: false,
  status: false,
  message: '',
};

const ToastReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        showToast: true,
        status: action.payload.status ?? true,
        message: action.payload.message,
      };

    case HIDE_TOAST:
      return {
        ...state,
        showToast: false,
        message: '',
      };

    default:
      return state;
  }
};

export default ToastReducers;
