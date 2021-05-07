const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

exports.joinRoom = async (namespaceId, socketId, username, io, socket) => {
  try {
    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("room not found");

    let new_user = { username: username, socketId: socketId, isHost: false };

    room.users.push(new_user);
    room = await room.save();

    let users = room.users;
    let userId = users[users.length - 1]._id;

    io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_ROOM, { room });

    io.of(namespaceId).to(socketId).emit(SocketEvents.SERVER_UPDATE_USER, {
      userId: userId,
      socketId: socketId,
      username: username,
      isHost: false,
    });

  } catch (e) {
    console.log(e);
  }
};

exports.createRoom = async (namespaceId, socketId, username, io, socket) => {
  try {
    let new_room = new RoomModel({
      namespaceId: namespaceId,
      users: { username: username, socketId: socketId, isHost: true },
    });

    await new_room.save()
      .then((room) => {
        return room;
      })
      .catch((e) => {
        console.log(e);
      });

    let userId = new_room.users[0]._id;

    io.of(namespaceId).to(socketId).emit(SocketEvents.SERVER_UPDATE_USER, {
      userId: userId,
      socketId: socketId,
      username: username,
      isHost: true,
    });

  } catch (e) {
    console.log(e);
  }
};

exports.checkForExistingRoom = async (namespaceId) => {
  try {
    let room = await RoomModel.find({
      namespaceId: "/" + namespaceId.toString(),
    });

    return room;

  } catch (e) {
    console.log(e);
  }
};

exports.checkForExistingUsername = async (namespaceId, username) => {
  try {
    let user = await RoomModel.find({
      namespaceId: "/" + namespaceId.toString(),
      "users.username": username,
    });

    return user;

  } catch (e) {
    console.log(e);
  }
};




