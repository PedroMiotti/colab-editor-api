// Socket IO
const socketio = require("socket.io");

const ioEvents = require("./constants/socketEvents.js");

module.exports = (http) => {
  // Allowing CORS - Aparentely it doenst get recognize it by express
  // ref - https://stackoverflow.com/questions/35713682/socket-io-gives-cors-error-even-if-i-allowed-cors-it-on-server
  const options = {
    cors: true,
    origins: ["*"],
  };

  const io = socketio(http, options);

  const namespaces = io.of(/^\/[a-zA-Z0-9_\/-]+$/);

  namespaces.on(ioEvents.CONNECT, (socket) => {
    const namespace = socket.nsp;
    const namespaceDir = namespace.name;

    console.log("connected " + socket.id);

    socket.on(ioEvents.CREATEROOM, (data) => {
      console.log(data);
    });

  });

  return io;
};
