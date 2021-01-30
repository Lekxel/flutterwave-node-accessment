const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const jsendFormatter = require("./helpers/jsendFormatter");

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

//Handle the Routes
app.use("/", require("./routes/info"));
app.use("/validate-rule", require("./routes/validate-rule"));

//Handle Errors
app.use(function (error, request, response, next) {
  return response
    .status(400)
    .send(jsendFormatter(`Invalid JSON payload passed.`, "error", null));
});

//Handle 404 routes
app.all("*", (request, response) => {
  return response
    .status(404)
    .send(jsendFormatter(`Invalid route`, "error", null));
});

app.listen(PORT);
