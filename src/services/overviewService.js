import axios from 'axios';
import tokenUtils from '../utils/tokenUtils';
const API_URL = "http://64.227.158.253";

const get_recents = async () => {
    const token = tokenUtils.getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(`${API_URL}/notifications/view_recents`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const get_notifications = async () => {
    const token = tokenUtils.getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(`${API_URL}/notifications/view_notifications`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const get_requests = async () => {
    const token = tokenUtils.getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    try {
        const response = await axios.get(`${API_URL}/work/requests`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const get_assigned = async () => {
    const token = tokenUtils.getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    try {
        const response = await axios.get(`${API_URL}/work/assigned`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export default {
    get_recents,
    get_notifications,
    get_requests,
    get_assigned,
};