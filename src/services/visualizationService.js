import axios from 'axios';
import tokenUtils from '../utils/tokenUtils';
const API_URL = "http://64.227.158.253";

const create_visualization = async (formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
        const response = await axios.post(`${API_URL}/vis/create_visualization`, formData, config);
        return response.data;
    }   
    catch (error) {
        return error.response.data;
    }
}


const delete_visualization = async (visualization_id) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    try {
      const response = await axios.delete(`${API_URL}/vis/delete_visualization/${visualization_id}`, config);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

const get_visualizations = async () => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
        const response = await axios.get(`${API_URL}/vis/list_visualizations`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const edit_visualization = async (visualization_id, formData) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
        const response = await axios.put(`${API_URL}/vis/edit_vis/${visualization_id}`, formData, config);
        return response.data;
    }   
    catch (error) {
        return error.response.data;
    }
}

export default {
    create_visualization,
    delete_visualization,
    get_visualizations,
    edit_visualization,
}