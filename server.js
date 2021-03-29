"use strict";

// Imports 
const express = require('express');
const app = express();

const cors = require('cors');


// CONFIG 
// Express body parser
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors());


module.exports = app;


