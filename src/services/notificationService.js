import axios from "axios";
import tokenUtils from "../utils/tokenUtils";
const API_URL = "http://64.227.158.253";

const send_single_notification = async (payload) => {
  const token = tokenUtils.getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const email = payload.email;
    const message = payload.message;
    const response = await axios.post(
      `${API_URL}/notifications/send_single`,
      {
        email: email,
        message: message,
      },
      config
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "Failed to send notification",
    };
  }
};

const send_group_notification = async (payload) => {
  const token = tokenUtils.getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const message = payload.message;
    const formData = new FormData();
    formData.append("message", message);
    if(payload.role){
      formData.append("role", payload.role);
    }
    if(payload.department){
      formData.append("department", payload.department);
    }
    const response = await axios.post(
      `${API_URL}/notifications/send_group`,
      formData,
      config
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throw {
      status: error.response?.status,
      message:
        error.response?.data?.message || "Failed to send group notification",
    };
  }
};

export default {
  send_single_notification,
  send_group_notification,
};
