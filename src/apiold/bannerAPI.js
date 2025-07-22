// authApi.js
import { API_MULTIPART_CONFIG } from "../../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../../utils/apiAthurization";

export const StoreBanner = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/banners`,'POST',data,'multipart'
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

export const GetBanners = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/banners`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "brand banners fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetBannerById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/banners/${id}`
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

export const UpdateBanner = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/banners/${id}`,'PATCH',data,'multipart'
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

export const DeleteBanner = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/banners/${id}`,'DELETE'
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