const express = require("express");
const router = express.Router();
const jsendFormatter = require("../helpers/jsendFormatter");
const { isJSON } = require("../helpers/validation");
const validateRequiredFields = require("../helpers/validateRequiredFields");

const ruleTypes = ["field", "condition", "condition_value"];

//Route to validate the data
router.post("/", (request, response, next) => {
  //Get the body from the post request
  const { body } = request;

  //Define error handler
  const throwError = (message, data = null) => {
    return response.status(400).send(jsendFormatter(message, "error", data));
  };

  //Define success handler
  const returnSuccess = (message, data = {}) => {
    return response.status(200).send(jsendFormatter(message, "success", data));
  };

  //Validate correct request data
  if (!isJSON(body, next)) {
    return response
      .status(400)
      .send(jsendFormatter("Invalid JSON payload passed.", "error", null));
  }

  //Validate if all the required fields are present
  let fieldNotPresent = validateRequiredFields(body);
  if (fieldNotPresent) {
    return response
      .status(400)
      .send(jsendFormatter(`${fieldNotPresent} is required.`, "error", null));
  }

  //If the rule field is of the required type
  if (!isJSON(body.rule, next)) {
    return response
      .status(400)
      .send(jsendFormatter(`rule should be an object.`, "error", null));
  }

  //If data is of the required type
  if (
    !isJSON(body.data, next) &&
    typeof body.data !== "object" &&
    typeof body.data !== "string"
  ) {
    return response
      .status(400)
      .send(jsendFormatter(`data should be an object.`, "error", null));
  }

  //check if all the required fields exist in the `rule` object
  for (let field of ruleTypes) {
    if (!body.rule[field]) {
      return response
        .status(400)
        .send(
          jsendFormatter(`field ${field} is missing from rule.`, "error", null)
        );
    }
  }

  //Check if the field is an object
  let fieldArray = body.rule.field.split(".");

  let i = 0,
    toBeValidated = body.data;

  //Check if the required field in the data object is missing
  while (i < fieldArray.length) {
    if (!toBeValidated[fieldArray[i]]) {
      return throwError(`field ${body.rule.field} is missing from data.`);
    }
    toBeValidated = toBeValidated[fieldArray[i]];
    i++;
  }

  const { condition, condition_value, field } = body.rule;
  let isValid = undefined;

  //Handle the condition
  switch (condition) {
    case "eq":
      isValid = toBeValidated == condition_value;
      break;
    case "neq":
      isValid = toBeValidated != condition_value;
      break;
    case "gt":
      isValid = toBeValidated > condition_value;
      break;
    case "gte":
      isValid = toBeValidated >= condition_value;
      break;
    case "contains":
      isValid = toBeValidated.indexOf(condition_value) > -1;
      break;
    default:
      return throwError(`field ${field} failed validation.`, {
        validation: {
          error: true,
          field: field,
          field_value: toBeValidated,
          condition: condition,
          condition_value: condition_value,
        },
      });
  }

  let returnData = {
    validation: {
      error: !isValid,
      field: field,
      field_value: toBeValidated,
      condition: condition,
      condition_value: condition_value,
    },
  };

  //Check if the rule validates
  isValid
    ? returnSuccess(`field ${field} successfully validated.`, returnData)
    : throwError(`field ${field} failed validation.`, returnData);
});

module.exports = router;
