const client = require("../infra/redis");

const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require('../models/index');

// exports.createRoom = async (namespaceId, socketId, username, io) => {
//   try {
//     let activeUsers = [];

//     await exports.joinRoom(namespaceId, socketId, username);

//     await exports.activeUserOnNamespace(namespaceId, (users) => {
//       activeUsers = users;

//       io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_ROOM, { activeUsers });
//     });
//   } catch (e) {
//     console.log(e);
//   }
// }

exports.joinRoom = async (namespaceId, socketId, username, io) => {
  // await client.createConnection().then((client) => {

  //   client.hmset(namespaceId, username, socketId );

  // });

  await RoomModel.findOneAndUpdate({ namespaceId }, {users: {username, socketId, isHost: false}});

  await RoomModel.find({ namespaceId }, (err, rooms) => {
    console.log(rooms);
  })

  io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_ROOM, { activeUsers });
}

exports.createRoom = async (namespaceId, socketId, username) => {
  // await client.createConnection().then((client) => {

  //   client.hmset(namespaceId, username, socketId );

  // });

  let new_room = new RoomModel({namespaceId, users: { username, socketId, isHost: true }});

  await new_room.save().then(user => {
    console.log(user);
  }).catch(e => {
    console.log(e);
  })

}

exports.checkForExistingNamespace = async (namespaceId, cb) => {
  let concat = "/" + namespaceId;

  await client.createConnection().then((client) => {
    let exists;
    // Check if the namespace id exists
    client.exists(concat, (err, reply) => {

      if (reply === 1) exists = true;
      else exists = false;

      return cb(exists);
    });
  });
};

exports.checkForExistingUsername = async (namespaceId, username, cb) => {
  let exists;

  let concat = '/' + namespaceId;

  await client.createConnection().then((client) => {
    client.hexists(concat, username, (err, reply) => {

      if (reply === 1) exists = true;
      else exists = false;

      return cb(exists);
    });
  });
};

exports.activeUserOnNamespace = async (namespaceId, cb) => {

  let activeClients = [];
  await client.createConnection().then((client) => {

    client.hkeys(namespaceId,  (err, value) => {
      activeClients = value;

      cb(activeClients);
    })
  })

}

exports.updateUserSocketID = async (namespaceId, socketId, username) => {

  await client.createConnection().then(async (client) => {
    // Check if there is only one value in the room
    await client.hlen(namespaceId, async (err, value) => {
      
      if(value === 1){
        // get the username for the creator of the room
        await client.hkeys(namespaceId, (err, value) => {
          client.hset(namespaceId, value[0], socketId);
        })
      }
    })

    // client.hset(namespaceId, username, socketId);
  });

}
