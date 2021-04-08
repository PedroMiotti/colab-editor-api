"use strict";

// IMPORTS
// Socket IO
const { createServer } = require("http");
const createSocket = require("./socketio.js");
//App.js
const app = require("./app.js");

const PORT = process.env.PORT || 3005;
const http = createServer(app);

createSocket(http);

http.listen(PORT, () => {
  console.log(`Server up ! ${PORT}`);
});
