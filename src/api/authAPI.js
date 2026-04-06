// authApi.js
import { API_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const LoginApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller/auth/login`,
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

export const VerifyLoginOtpApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller/auth/verify-login-otp`,
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

export const SignupApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller/auth/signup`,
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

export const VerifySignupOtpApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/seller/auth/verify-signup-otp`,
      data, // Send data in the request body
      { headers: API_CONFIG.headers } // Pass headers correctly
    );
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

export const GetDashboardData = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/get-dashboard-data`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "brand products fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};
