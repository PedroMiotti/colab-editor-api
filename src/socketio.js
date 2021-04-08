// Socket IO
const socketio = require("socket.io");

const ioEvents = require("../constants/socketEvents.js");

const {
  createOrJoinRoom,
  checkForExistingNamespace,
  updateUserSocketID,
  activeUserOnNamespace,
} = require("./services/user.service.js");

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

    let activeUsers = [];

    socket.on("create:room", async (data) => {
      try{

        await createOrJoinRoom(namespaceDir, socket.id, data);
        
        await activeUserOnNamespace(namespaceDir, (users) => {
          activeUsers = users;

          io.of(namespaceDir).emit("update:room", { activeUsers })
        });


      }
      catch(e){
        console.log(e)
      }


    });

    socket.on("join:room", (data) => {
      createOrJoinRoom(namespaceDir, socket.id, data);
    });

    console.log("connected " + socket.id + " On namespace: " + namespaceDir);

    socket.on(ioEvents.DISCONNECT, (data) => {
      console.log(
        "Socket disconnected " + socket.id + " On namespace: " + namespaceDir
      );
    });
  });

  return io;
};
