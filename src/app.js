"use strict";

// IMPORTS
// Express
const express = require("express");
const app = express();
// Cors
const cors = require("cors");
// Helmet
const helmet = require("helmet");

const Room = require('./routes/api/room.js');

// CONFIG
// Helmet
app.use(helmet());
// cors
app.use(cors());

app.use('/api/v1/room', Room);


module.exports = app;
