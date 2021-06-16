// Socket IO
const socketio = require("socket.io");

const SocketEvents = require("./constants/socketEvents");

const RoomService = require("./services/room.service");
const FileService = require("./services/file.service");


module.exports = (http) => {
  // Allowing CORS - Aparently it doesnt get recognize it by express
  // REF - https://stackoverflow.com/questions/35713682/socket-io-gives-cors-error-even-if-i-allowed-cors-it-on-server
  const options = {
    cors: true,
    origins: ["*"],
  };

  const io = socketio(http, options);

  const namespaces = io.of(/^\/[a-zA-Z0-9_\/-]+$/);

  namespaces.on(SocketEvents.CONNECT, (socket) => {
    const namespace = socket.nsp;
    const namespace_id = namespace.name;

    console.log("connected " + socket.id + " On namespace: " + namespace_id);

    socket.on(SocketEvents.CLIENT_CREATE_ROOM, async (data) => { await RoomService.createRoom(namespace_id, socket.id, data, io, socket) });

    socket.on(SocketEvents.CLIENT_JOIN_ROOM, async (data) => { await RoomService.joinRoom(namespace_id, socket.id, data, io, socket) });

    socket.on(SocketEvents.CLIENT_CREATE_FILE, async (data) => { await FileService.createFile(data, namespace_id, io ) });

    socket.on(SocketEvents.CLIENT_JOIN_FILE, async (data) => { await FileService.joinFile(data.prevFile, data.currentFile, namespace_id, socket.id, socket, io ) });

    socket.on(SocketEvents.CLIENT_UPDATE_CODE, async (data) => { await FileService.updateCode(data, socket.id, namespace_id, socket, io ) });

    socket.on(SocketEvents.CLIENT_USER_LEFT, async () => { await RoomService.leaveRoom(namespace_id, socket.id, io, socket) });

    socket.on(SocketEvents.DISCONNECT, async () => { await RoomService.leaveRoom(namespace_id, socket.id, io, socket) });
  });

  return io;
};
