/**
 * `description` Validates if the json is a valid json object
 * @param {*} json
 * @param {*} next
 * @returns object | false
 */
const isJSON = (json, next) => {
  try {
    //Verify if the data is a valid json
    return json instanceof Array || json instanceof Object ? json : false;
  } catch (e) {
    next(e);
  }
  return false;
};

module.exports = { isJSON };
