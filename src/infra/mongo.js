const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(`mongodb://${process.env.MONGO_URI}/${process.env.MONGO_NAME}`, { useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;
