const buildFormData = (type, data, fileKey = null, file = null) => {
  const formData = new FormData();
  formData.append("type", type);

  const appendData = (obj, parentKey = "") => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value !== undefined && value !== null) {
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null &&
          !(value instanceof File)
        ) {
          // If the value is a nested object, recurse
          appendData(value, formKey);
        } else if (key !== fileKey) {
          // Append simple values
          formData.append(formKey, value);
        }
      }
    });
  };

  appendData(data);

  if (fileKey && file) {
    formData.append("file", file); // attach file
  }

  return formData;
};

/**
 * Calculates the profile completion status based on required fields.
 * @param {object} profileData - The user's profile data object.
 * @returns {object} An object containing completion percentages and a boolean flag.
 */
const checkProfileCompletion = (profileData) => {
  if (!profileData) {
    return {
      isComplete: false
    };
  }

  const {
    businessDetails,
    brandDetails,
    bankDetails,
    addressDetails
  } = profileData;

  const isBusinessUpdated = businessDetails?.updated === true;
  const isBrandUpdated = brandDetails?.updated === true;
  const isBankUpdated = bankDetails?.updated === true;
  const isAddressUpdated = addressDetails?.updated === true;

  const isComplete =
    isBusinessUpdated &&
    isBrandUpdated &&
    isBankUpdated &&
    isAddressUpdated;

  return {
    isBusinessUpdated,
    isBrandUpdated,
    isBankUpdated,
    isAddressUpdated,
    isComplete
  };
};

const numberToWords = (num) => {
  if (num === 0) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const getWords = (n) => {
    let str = "";

    if (n > 19) {
      str += tens[Math.floor(n / 10)] + " " + ones[n % 10];
    } else {
      str += ones[n];
    }

    return str.trim();
  };

  const convert = (n) => {
    let result = "";

    if (n >= 10000000) {
      result += convert(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }

    if (n >= 100000) {
      result += convert(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }

    if (n >= 1000) {
      result += convert(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n > 0) {
      result += getWords(n) + " ";
    }

    return result.trim();
  };

  return convert(num) + " Rupees Only";
};

export { buildFormData, checkProfileCompletion, numberToWords };
