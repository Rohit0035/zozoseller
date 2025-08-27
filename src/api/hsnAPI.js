// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const StoreHsn = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns`,'POST',data
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

export const StoreHsnBulk = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns/bulk`,'POST',data
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

export const GetHsns = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns?categoryId=${data?.categoryId}`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "hsns fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetHsnById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns/${id}`
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

export const UpdateHsn = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns/${id}`,'PATCH',data
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

export const DeleteHsn = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/hsns/${id}`,'DELETE'
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