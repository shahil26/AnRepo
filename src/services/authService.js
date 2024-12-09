/* eslint-disable no-useless-catch */
import axios from 'axios';
import tokenUtils from '../utils/tokenUtils';
const API_URL = "http://64.227.158.253";

// Login Service
const login = async (institute_id, email_id, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            institute_id,
            email_id,
            password
        });
        if (response?.data?.data?.token) {
            tokenUtils.setToken(response.data.data.token);
            return response.data.data;
        }
        else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        throw error;
    }
};

const send_contact = async (email, phone, institute) => {
    try {
        const response = await axios.post(`${API_URL}/auth/contact_landing`, {
            email,
            phone,
            institute
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Logout service
const logout = () => {
    tokenUtils.removeToken();
};

const validateToken = async () => {
    try {
        const uri = `${API_URL}/auth/validate_token`;
        const response = await axios.get(uri, {
            headers: {
                Authorization: `Bearer ${tokenUtils.getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        tokenUtils.removeToken();
        throw error;
    }
};

const updateProfile =  async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/update_profile`, profileData, {
        headers: {
          Authorization: `Bearer ${tokenUtils.getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
};

// Send OTP service
const sendOtp = async (institute_id, email_id) => {
    try {
        const response = await axios.post(`${API_URL}/auth/send_otp`, { institute_id, email_id });
        return response;
    } catch (error) {
        throw error;
    }
};

// Verify OTP and Create Password service
const verifyOtp = async (institute_id, email_id, otp, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify_otp`, {
            institute_id,
            email_id,
            otp,
            password,
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export default {
    login,
    sendOtp,
    logout,
    verifyOtp,
    validateToken,
    updateProfile,
    send_contact
};