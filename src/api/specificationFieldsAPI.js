// authApi.js
import { API_CONFIG, API_MULTIPART_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const StoreSpecificationFields = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields`,'POST',data
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

export const GetSpecificationFields = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields?subCategoryTwoId=${data?.subCategoryTwoId}`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "Sub Categories Two fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const GetSpecificationFieldsById = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields/${id}`
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

export const GetSpecificationFieldsBySubsCategoryTwoId = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields/get-specification-fields-by-sub-category-two-id/${data?.subCategoryTwoId}`
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

export const UpdateSpecificationFields = async (id,data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields/${id}`,'PATCH',data
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

export const DeleteSpecificationFields = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/specification-fields/${id}`,'DELETE'
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