// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../../utils/apiAthurization";

export const StoreVendor = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/vendors`,'POST',data,'multipart'
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

export const GetVendors = async (VendorCategoryId) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/vendors`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "Vendors fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetVendorById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/vendors/${id}`
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

export const UpdateVendor = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/vendors/${id}`,'PATCH',data,'multipart'
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

export const DeleteVendor = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/vendors/${id}`,'DELETE'
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

export const UpdateVendorStatus = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/vendors/update-vendor-status/`,'POST',data
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