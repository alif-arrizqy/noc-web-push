const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initRoutes(app);

// const port = 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
