const mongoose = require('../infra/mongo');

let roomSchema = new mongoose.Schema({
    namespaceId: {
        type: String,
        required: true
    },
    files: [{
        filename: String ,
        text: String ,
        userCount: Number,
    }],
    users: [{
        username: String ,
        socketId: String ,
        isHost: Boolean
    }],
    updated_At: { 
        type: Date, 
        default: Date.now 
    },
    created_At: { 
        type: Date, 
        default: Date.now 
    },
});


const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
