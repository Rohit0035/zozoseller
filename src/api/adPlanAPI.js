// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const StoreAdPlan = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-plans`,'POST',data
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

export const GetAdPlans = async () => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-plans`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "ad-plans fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetAdPlanById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-plans/${id}`
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

export const UpdateAdPlan = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-plans/${id}`,'PATCH',data
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

export const DeleteAdPlan = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/ad-plans/${id}`,'DELETE'
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