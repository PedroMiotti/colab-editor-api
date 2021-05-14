"use strict";

// IMPORTS
// Express
const express = require("express");
const app = express();
// Cors
const cors = require("cors");
// Helmet
const helmet = require("helmet");
// Body-parser
const bodyParser = require('body-parser')
// .env
require('dotenv').config();
//Routes
const RoomRoute = require('./routes/api/room.js');
const FileRoute = require('./routes/api/file.js');


// CONFIG
// Helmet
app.use(helmet());
// cors
app.use(cors());
// Body-Parse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROUTES
app.use('/api/v1/room', RoomRoute);
app.use('/api/v1/file', FileRoute);



module.exports = app;
