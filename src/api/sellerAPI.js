// authApi.js
import { API_CONFIG } from "../utils/api-config";
import axios from "axios";

export const sellerLogin = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller-auth/seller-login`,
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

export const sellerVerifyLoginOtp = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller-auth/seller-verify-login-otp`,
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

export const sellerRegistration = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller-auth/seller-register`,
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

export const sellerVerifyRegistrationOtp = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller-auth/seller-verify-register-otp`,
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
