import axios from 'axios';
import { API_CONFIG, API_MULTIPART_CONFIG } from './api-config';

const fetchWithAuth = async (url, method = 'GET', data = null, contentType = 'json') => {
  let config;
  if (contentType === 'json') {
    config = API_CONFIG;
  } else if (contentType === 'multipart') {
    config = API_MULTIPART_CONFIG;
  } else {
    throw new Error('Unsupported content type');
  }

  const headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1")}`,
  };

  const axiosConfig = {
    url,
    method,
    headers,
  };

  if (data) {
    if (contentType === 'json') {
      axiosConfig.data = data; // axios handles JSON stringification
    } else if (contentType === 'multipart') {
      axiosConfig.data = data; // Directly assign the FormData object
      // delete axiosConfig.headers['Content-Type']; // Remove Content-Type for FormData
    }
  }

  try {
    const response = await axios(axiosConfig);
    // console.log(response)
    return response; // axios automatically parses JSON

  } catch (error) {
    if (error.response) {
      const data = error.response.data
      throw new Error(`${data.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server.");
    } else {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
};

export default fetchWithAuth;