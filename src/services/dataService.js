import axios from 'axios';
import tokenUtils from '../utils/tokenUtils';
const API_URL = "http://64.227.158.253";

const upload_data = async (formData) => {
  const token = tokenUtils.getToken();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${API_URL}/data/upload_file`, formData, config);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const get_data = async () => {
  const token = tokenUtils.getToken();
  const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await axios.get(`${API_URL}/data/list_files`, config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const download_data = async (fileId) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important: treat the response as binary data (file)
    };
  
    try {
      const response = await axios.get(`${API_URL}/data/download_file/${fileId}`, config);
      
      // Create a URL for the blob
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = URL.createObjectURL(blob);
      
      // Extract filename from Content-Disposition, if available
      let filename = 'downloaded_file';
      const contentDisposition = response.headers['content-disposition'];
      console.log(contentDisposition);
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].trim();
        filename = filename.replace(/['"]/g, ''); // Remove any quotes around filename
      }
  
      // Create a temporary anchor element and trigger a download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename; // Use extracted or default filename
      document.body.appendChild(a);
      a.click();
  
      // Cleanup
      a.remove();
      URL.revokeObjectURL(downloadUrl); // Clean up after download
    } catch (error) {
      console.error("Download error", error);
      return error.response?.data || error.message;
    }
};
  
const delete_data = async (fileId) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    try {
      const response = await axios.delete(`${API_URL}/data/delete_file/${fileId}`, config);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

const peek_data = async (fileId) => {
    const token = tokenUtils.getToken();
    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
    };


    try {
        const response = await axios.get(`${API_URL}/data/peek_file/${fileId}`, config);
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export default {
    upload_data,
    get_data,
    download_data,
    delete_data,
    peek_data,
};