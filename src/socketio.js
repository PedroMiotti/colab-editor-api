// Socket IO
const socketio = require("socket.io");

const SocketEvents = require("./constants/socketEvents");

const RoomService = require("./services/room.service");

module.exports = (http) => {
  // Allowing CORS - Aparently it doenst get recognize it by express
  // REF - https://stackoverflow.com/questions/35713682/socket-io-gives-cors-error-even-if-i-allowed-cors-it-on-server
  const options = {
    cors: true,
    origins: ["*"],
  };

  const io = socketio(http, options);

  const namespaces = io.of(/^\/[a-zA-Z0-9_\/-]+$/);

  namespaces.on(SocketEvents.CONNECT, (socket) => {
    const namespace = socket.nsp;
    const namespace_name = namespace.name;

    socket.on(SocketEvents.CLIENT_CREATE_ROOM, async (data) => { await RoomService.createRoom(namespace_name, socket.id, data, io) });

    socket.on(SocketEvents.CLIENT_JOIN_ROOM, async (data) => { await RoomService.joinRoom(namespace_name, socket.id, data) });

    console.log("connected " + socket.id + " On namespace: " + namespace_name);

    socket.on(SocketEvents.DISCONNECT, (data) => { console.log("Socket disconnected " + socket.id + " On namespace: " + namespace_name ) });
  });

  return io;
};
