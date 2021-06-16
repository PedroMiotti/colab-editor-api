const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

const FileService = require('./file.service');


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
    let room = new RoomModel({
      namespaceId: namespaceId,
      users: { username: username, socketId: socketId, isHost: true },
    });

    await room.save()
      .then((new_room) => {
        return new_room;
      })
      .catch((e) => {
        console.log(e);
      });


    io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_ROOM, { room });

    let userId = room.users[0]._id;

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

exports.leaveRoom = async (namespaceId, socketId, io, socket) => {
  // Check if user is inside a file
  let socket_rooms = io.of(namespaceId).adapter.rooms;
  for (let [key, value] of socket_rooms) {
    if (key !== socketId && value.has(socketId)) {
      await FileService.leaveFile(key, socket, namespaceId)
    }
  }

  let room = await RoomModel.findOne({ namespaceId: namespaceId }).then(async (user) => {
    let userIdx = user.users.map((user) => user.socketId).indexOf(socketId)

    const userLeftInfo = user.users[userIdx];

    user.users.splice(userIdx, 1);

    await user.save();

    return [user, userLeftInfo];

  }).catch((err) => {
    console.log(err);
    return null;
  });

  if(room[0].users.length === 0){
    await RoomModel.deleteOne({ namespaceId: namespaceId });
    await FileService.deleteHashFromMemory(namespaceId);
  }

  io.of(namespaceId).emit(SocketEvents.SERVER_USER_LEFT, { room: room[0], userLeft: room[1] });
}

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
    return await RoomModel.findOne({namespaceId: "/" + namespaceId.toString()})
        .then(async (room) => {
          let userFound = room.users.map(user => user.username).indexOf(username);
          return userFound;
        });

  } catch (e) {
    console.log(e);
  }
};




