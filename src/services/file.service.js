const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

exports.createFile = async (fileName, namespaceId, io) => {
  try {
    if (!fileName || !namespaceId) {
        console.log('Nome do arquivo e a sala sao obrigatorios !');
    }

    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("Sala nao existe");

    let new_file = { filename: fileName, text: "" };

    room.files.push(new_file);
    room = await room.save();

    io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_FILES, { files: room.files });

  } catch (e) {
    throw new Error(e);
  }
};
