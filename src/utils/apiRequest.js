import axios from 'axios';
import { API_CONFIG } from './api-config';

const axiosInstance = axios.create(API_CONFIG);

export const apiRequest = async (method, endpoint, data = null) => {
  const config = {
    method,
    url: endpoint,
  };

  if (method === 'GET' || method === 'DELETE') {
    config.params = data;
  } else {
    config.data = data;
  }

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
