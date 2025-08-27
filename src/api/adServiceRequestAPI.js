// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const StoreAdServiceRequest = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-service-requests`,'POST',data
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

export const GetAdServiceRequests = async () => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-service-requests`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "ad-service-requests fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetAdServiceRequestById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-service-requests/${id}`
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

export const UpdateAdServiceRequest = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-service-requests/${id}`,'PATCH',data
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

export const DeleteAdServiceRequest = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-service-requests/${id}`,'DELETE'
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