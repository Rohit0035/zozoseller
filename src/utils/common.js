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

export { buildFormData, checkProfileCompletion };
