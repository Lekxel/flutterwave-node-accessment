const express = require("express");
const router = express.Router();
const jsendFormatter = require("../helpers/jsendFormatter");
const myInfo = require("../data/myInfo.json");

//Route to return my info
router.get("/", (request, response, next) => {
  return response.send(
    jsendFormatter("My Rule-Validation API", "success", myInfo)
  );
});

module.exports = router;
