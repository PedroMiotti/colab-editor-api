const client = require("../infra/redis");

/*
 * @param namespaceId: string - Namespace Id
 * @param socketId: string - The user who created the nsp
 */
exports.createOrJoinRoom = async (namespaceId, socketId, username) => {
  console.log(namespaceId)
  await client.createConnection().then((client) => {
    client.hmset(namespaceId, username, socketId );
  });
};

/*
 * @param namespaceId: string - Namespace Id
 */
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
