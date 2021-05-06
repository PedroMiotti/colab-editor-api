const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(`mongodb://localhost/colabeditor`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.Promise = global.Promise;

module.exports = mongoose;


//`mongodb://${process.env.MONGO_URI}/${process.env.MONGO_NAME}`