/**
 * `description` This formats the response to a valid jsend object
 * @param {*} message
 * @param {*} status
 * @param {*} data
 * @returns object
 */
const jsendFormatter = (message, status, data) => {
  return { message, status, data };
};

module.exports = jsendFormatter;
