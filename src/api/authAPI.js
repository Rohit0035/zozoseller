// authApi.js
import { API_CONFIG } from "../utils/api-config";
import axios from "axios";

export const login = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/login`,
      data, // Send data in the request body
      { headers: API_CONFIG.headers } // Pass headers correctly
    );
    console.log('response',response)
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.log(error)
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.response?.data?.message || "Login failed",
      statusCode: error?.response?.data?.status || 500 // Preserve status code
    };
  }
};

export const verifyLoginOtp = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/verify-login-otp`,
      data, // Send data in the request body
      { headers: API_CONFIG.headers } // Pass headers correctly
    );
    console.log('response',response)
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.log(error)
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.response?.data?.message || "Login failed",
      statusCode: error?.response?.data?.status || 500 // Preserve status code
    };
  }
};

export const registration = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/register`,
      data, // Send data in the request body
      { headers: API_CONFIG.headers } // Pass headers correctly
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.response?.data?.message || "signup failed",
      statusCode: error?.response?.data?.status || 500 // Preserve status code
    };
  }
};