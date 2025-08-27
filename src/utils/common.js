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
const checkProfileCompletion = profileData => {
  // Define the required fields for each section
  const accountFields = [
    "name",
    "email",
    "phone",
    "displayName",
    "businessDescription",
    "pickupAddress.line1",
    "pickupAddress.pinCode",
    "pickupAddress.city"
  ];
  const bankDetailsFields = ["bankName", "accountNo", "ifscCode", "branchName"];
  const businessDetailsFields = [
    "companyName",
    "tan",
    "gstin",
    "companyAddress",
    "signature",
    "businessType",
    "pan",
    "addressProof",
    "state",
    "brandDetails.brandType",
    "brandDetails.brandName",
    "brandDetails.brandNameCertificate"
  ];

  /**
   * Helper function to calculate completion percentage.
   * @param {object} data - The data object to check.
   * @param {string[]} requiredFields - An array of required field strings.
   * @returns {number} The completion percentage.
   */
  const calculatePercentage = (data, requiredFields) => {
    if (!data) return 0;

    let completedFields = 0;
    requiredFields.forEach(field => {
      // Handle nested fields like 'pickupAddress.pinCode'
      const parts = field.split(".");
      let value = data;
      let isFieldPresent = true;
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          isFieldPresent = false;
          break;
        }
      }

      if (isFieldPresent && value !== null && value !== "") {
        completedFields++;
      }
    });

    return Math.round(completedFields / requiredFields.length * 100);
  };

  const accountCompletion = calculatePercentage(profileData, accountFields);
  const bankDetailsCompletion = calculatePercentage(
    profileData,
    bankDetailsFields
  );
  const businessDetailsCompletion = calculatePercentage(
    profileData,
    businessDetailsFields
  );

  // Check if all sections are 100% complete
  const isComplete =
    accountCompletion === 100 &&
    bankDetailsCompletion === 100 &&
    businessDetailsCompletion === 100;

  return {
    accountCompletion,
    bankDetailsCompletion,
    businessDetailsCompletion,
    isComplete
  };
};

export { buildFormData, checkProfileCompletion };
