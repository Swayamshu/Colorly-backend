const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;

