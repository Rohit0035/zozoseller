// authApi.js
import { API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const GetSellerProfileData = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/seller/get-seller-profile-data`
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

export const UpdateSellerProfile = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/seller/update-seller-profile-data`,'POST',data,'multipart'
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