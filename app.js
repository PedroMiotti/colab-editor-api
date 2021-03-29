"use strict";

const app = require('./server.js');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  consol.log('Server up !');

});


