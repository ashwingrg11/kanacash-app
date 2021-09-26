import {
  PRESENT_MODAL,
  HIDE_MODAL,
  RESET_STORE,
  // SET_ERROR,
  // SET_SUCCESS,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
  presentModal: false,
  modalTitle: 'NA',
  modalMessage: 'NA',
  type: '',
};

const ModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRESENT_MODAL:
      return {
        ...state,
        presentModal: true,
        modalTitle: action.payload.message_title
          ? action.payload.message_title
          : 'NA',
        modalMessage: action.payload.message ? action.payload.message : 'NA',
        type: action.payload.type,
      };

    case HIDE_MODAL:
      return {
        ...state,
        presentModal: false,
      };

    case RESET_STORE:
      return {
        ...state,
        presentModal: false,
        modalTitle: 'NA',
        modalMessage: 'NA',
      };

    default:
      return state;
  }
};

export default ModalReducer;
