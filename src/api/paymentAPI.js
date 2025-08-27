// authApi.js
import { API_CONFIG } from "../utils/api-config";
import axios from "axios";
import fetchWithAuth from "../utils/apiAthurization";

export const PaymentOverview = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/payment-overview`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "payment overview fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getAvailableMonths = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/previous-payments/available-months`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "available months fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getPreviousPayments = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/previous-payments?month=${data.month}&startDate=${data.startDate}&endDate=${data.endDate}`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "previous payments fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getSearchOrderSettlements = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/search-order-settlements`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "search order settlements fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getInvoices = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/invoices`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "invoices fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getInvoiceDetails = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/invoice-details/${data.invoiceId}`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "invoices fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};

export const getReportData = async (data) => {
  try {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}/seller/report-data`
    );
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // throw new Error(error?.message || "Login failed");
    return { 
      status: "error", 
      message: error?.message || "invoices fetching failed",
      statusCode: error.response?.status || 500 // Preserve status code
    };
  }
};