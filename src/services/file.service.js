const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

exports.createFile = async (fileName, namespaceId, io) => {
  try {
    if (!fileName || !namespaceId) 
      console.log("Nome do arquivo e a sala sao obrigatorios !");
    
    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("Sala nao existe");

    let new_file = { filename: fileName, text: "" };

    room.files.push(new_file);
    room = await room.save();

    io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_FILES, {
      files: room.files,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.joinFile = async (prevFile, currentFile, namespaceId, socketId, socket, io) => {
  try {
    if (!currentFile || !namespaceId) 
      console.log("Nome do arquivo e a sala sao obrigatorios !");
    
    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("Sala nao existe");
    
    let socket_rooms = io.of(namespaceId).adapter.rooms
    // Check if user is already inside a room that is not the default.
    for (let [key, value] of socket_rooms) {
        if (key !== socketId && value.has(socketId)) { 
            socket.leave(prevFile);
        }
    }  

    io.of(namespaceId).to(currentFile).emit(SocketEvents.SERVER_USER_JOINED_FILE, {});
    
    socket.join(currentFile);

  } catch (e) {
      console.log(e);
  }
};

exports.updateCode = async (fileName, code, socketId, namespaceId, socket, io) => {
    try {
      if (!fileName || !namespaceId) 
        console.log("Nome do arquivo e a sala sao obrigatorios !");
      
      io.of(namespaceId).to(fileName).emit(SocketEvents.SERVER_UPDATE_CODE, {
        value: code,
        socketId: socketId
      });
      
    } catch (e) {
        console.log(e);
    }
  };
