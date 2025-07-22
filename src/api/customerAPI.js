// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../../utils/apiAthurization";

export const StoreCustomer = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers`,'POST',data
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

export const GetCustomers = async (VenCustomerCategoryId) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "VenCustomers fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetCustomerById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers/${id}`
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

export const UpdateCustomer = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers/${id}`,'PATCH',data
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

export const DeleteCustomer = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers/${id}`,'DELETE'
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

export const UpdateCustomerStatus = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/customers/update-vendor-order-status/`,'POST',data
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