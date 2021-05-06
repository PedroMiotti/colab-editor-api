const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(`mongodb://${MONGO_URI}/${MONGO_DB_NAME}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    })

    .then(() => {
        console.log('Mongo Ok!');
    })

    .catch(err => {
        console.log('Failed to connect to Mongo', err);
});