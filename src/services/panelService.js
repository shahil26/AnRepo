import axios from "axios";
import tokenUtils from "../utils/tokenUtils";
const API_URL = "http://64.227.158.253";

const request_access = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/admin/request_access`,
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

const approve_access = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/admin/approve_access`,
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
  }

  const disapprove_access = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/admin/disapprove_access`,
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
  }

  const add_access_roles = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/admin/add_access_roles`,
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
  }

  const modify_access_roles = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/admin/modify_access_roles`,
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
  }

    const list_requests = async () => {
        const token = tokenUtils.getToken();
        const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await axios.get(`${API_URL}/admin/list_access_requests`, config);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }


export default {
    request_access,
    approve_access,
    disapprove_access,
    add_access_roles,
    modify_access_roles,
    list_requests,
};
