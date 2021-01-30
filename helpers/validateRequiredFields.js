const requiredFields = ["rule", "data"];

/**
 * `description` Validates if each of the required fields is in the data
 * @param {*} data
 * @returns string|boolean
 */
const validateRequiredFields = (data) => {
  if (!data) return false;

  for (let field of requiredFields) {
    if (typeof data[field] == "undefined") {
      return field;
    }
  }
  return false;
};

module.exports = validateRequiredFields;
