import axios from "axios";
import { USER_AVATAR_EDIT_URL } from "./constants";
import { getConfig } from "../utils/config";

export const avatarEditApi = file => {
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      Authorization: getConfig().headers.Authorization,
      "content-type": "multipart/form-data"
    }
  };
  return axios.post(USER_AVATAR_EDIT_URL, formData, config);
};
