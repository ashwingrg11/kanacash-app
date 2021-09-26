import {
  PRESENT_LOADER,
  HIDE_LOADER,
} from '~/store/actions/constant/ActionTypes';

export const showLoader = () => dispatch => {
  dispatch({
    type: PRESENT_LOADER,
  });
};

export const hideLoader = () => dispatch => {
  dispatch({
    type: HIDE_LOADER,
  });
};
