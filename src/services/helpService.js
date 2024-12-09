import axios from "axios";
import tokenUtils from "../utils/tokenUtils";
const API_URL = "http://64.227.158.253";

const contact = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/auth/contact_us`,
        formData,
        config
      );
      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || 'An error occurred'
      };
    }
  };

const chat = async (formData) => {
  const token = tokenUtils.getToken();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${API_URL}/chat/ask`, formData, config);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getFAQ = async () => {
  try {
    const response = await axios.get(`${API_URL}/doc/faq`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}


const getDocs = async () => {
  try {
    const response = await axios.get(`${API_URL}/doc/docs`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export default {
  contact,
  chat,
  getFAQ,
  getDocs
};
