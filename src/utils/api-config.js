// const API_BASE_URL = "http://127.0.0.1:5000/api/v2";
// export const IMAGE_URL = "http://localhost:5000";
// export const RAZORPAY_KEY_ID = "rzp_test_sbbCHuQzenmT45";

// const API_BASE_URL = "http://3.110.247.112/zozo_cart_api/api/v2";
// export const IMAGE_URL = "http://3.110.247.112/zozo_cart_api";

// const API_BASE_URL = "https://kbtube.com/zozokart-api/api/v2";
// export const IMAGE_URL = "https://kbtube.com/zozokart-api/";

const API_BASE_URL = "https://api.zozokart.com/api/v2";
export const IMAGE_URL = "https://api.zozokart.com";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
};

export const API_MULTIPART_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data"
  }
};
