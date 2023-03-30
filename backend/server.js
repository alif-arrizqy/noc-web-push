const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initRoutes(app);

// const port = 8088
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
