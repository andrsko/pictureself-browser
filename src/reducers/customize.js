import { EDIT_CUSTOMIZATIONS } from "../actions/types";

const initialState = {};

const customize = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_CUSTOMIZATIONS:
      return {
        ...state,
        ...action.customization,
      };
    default:
      return state;
  }
};

export default customize;
