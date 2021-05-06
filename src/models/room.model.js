const { Schema, model } = require('mongoose')

var roomSchema = new Schema({
    namespaceId: {
        type: String,
        required: true
    },
    files: [{
        filename: String ,
        text: String ,
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
})


const Room = model('Room', roomSchema);

module.exports = Room;
