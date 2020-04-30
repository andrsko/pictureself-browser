import { EDIT_CUSTOMIZATIONS } from "./types";

export const editCustomization = (newCustomization) => {
  return {
    type: EDIT_CUSTOMIZATIONS,
    customization: newCustomization,
  };
};
