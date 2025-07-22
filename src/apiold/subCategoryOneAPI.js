// authApi.js
import { API_MULTIPART_CONFIG } from "../../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../../utils/apiAthurization";

export const StoreSubCategoryOne = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/sub-categories-one`,'POST',data,'multipart'
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

export const GetSubCategoriesOne = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/sub-categories-one?categoryId=${data?.categoryId}`,
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "brand sub-categories-one fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetSubCategoryOneById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/sub-categories-one/${id}`
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

export const UpdateSubCategoryOne = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/sub-categories-one/${id}`,'PATCH',data,'multipart'
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

export const DeleteSubCategoryOne = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_MULTIPART_CONFIG.baseURL}/sub-categories-one/${id}`,'DELETE'
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