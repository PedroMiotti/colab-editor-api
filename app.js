"use strict";

// IMPORTS 
// Express
const express = require('express');
const app = express();
// Cors
const cors = require('cors');
// Helmet 
const helmet = require('helmet');


// CONFIG 
// Helmet
app.use(helmet());
// cors
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;
