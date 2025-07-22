// authApi.js
import { API_MULTIPART_CONFIG } from "../../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../../utils/apiAthurization";

export const StoreCategory = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/categories`,'POST',data,'multipart'
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

export const GetCategories = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/categories`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "brand categories fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetCategoryById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/categories/${id}`
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

export const UpdateCategory = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/categories/${id}`,'PATCH',data,'multipart'
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

export const DeleteCategory = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/categories/${id}`,'DELETE'
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