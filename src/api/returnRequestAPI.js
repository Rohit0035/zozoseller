// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const GetReturnRequests = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/return-requests`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "return-requests fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const UpdateStatus = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/return-requests/update-status/`,'POST',data
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "signup failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};