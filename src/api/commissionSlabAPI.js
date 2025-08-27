// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const StoreCommissionSlab = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs`,'POST',data
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

export const GetCommissionSlabs = async () => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "commission-slabs fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetCommissionSlabById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs/${id}`
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

export const GetCommissionSlabsBySubsCategoryTwoId = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs/get-commission-slabs-by-sub-category-two-id/${data?.subCategoryTwoId}`
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

export const UpdateCommissionSlab = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs/${id}`,'PATCH',data
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

export const DeleteCommissionSlab = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/commission-slabs/${id}`,'DELETE'
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