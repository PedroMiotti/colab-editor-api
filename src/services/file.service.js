const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

const redisClient = require("../infra/redis");

const automerge = require("automerge");

const DEFAULT_PROGRAM = "// Insert code here";

exports.createFile = async (fileName, namespaceId, io) => {
  try {
    if (!fileName || !namespaceId)
      console.log("Nome do arquivo e a sala sao obrigatorios !");

    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("Sala nao existe");

    let doc = automerge.init();
    doc = automerge.change(doc, (docRef) => {
      docRef.content = new automerge.Text();
      docRef.content.insertAt(0, ...DEFAULT_PROGRAM.split(""));
    });

    let new_file = {
      filename: fileName,
      text: JSON.stringify(automerge.save(doc)),
    };

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

    let storedFileText = '';

    // Check if the file is already open on redis
    let documentTextInMemory = await getFileInMemory(namespaceId, currentFile).then((doc) => {
      if (doc) return doc;

      else return null;
    }).catch(err => {
      console.log(err);
    })

    if (documentTextInMemory) {
      storedFileText = documentTextInMemory;

    } else {
      // Get the content of the file from Mongo
      let getStoredFileText = await RoomModel.findOne({ namespaceId: namespaceId }).then((doc) => {
        let fileIdx = doc.files.map((file) => file.filename).indexOf(currentFile);
        let fileText = doc.files[fileIdx].text; // min 10984 bytes

        return fileText;

      }).catch((err) => {
        console.log(err);
        return;
      });

      // Inserting the file into redis
      await redisClient.createConnection().then((client) => {

        client.hset(namespaceId, currentFile, getStoredFileText);

      }).catch((err) => {
        console.log(err);
        return;
      });

      storedFileText = getStoredFileText;
    }

    // Check if user is already inside a room that is not the socket default.
    let socket_rooms = io.of(namespaceId).adapter.rooms;
    for (let [key, value] of socket_rooms) {
      if (key !== socketId && value.has(socketId)) {
        socket.leave(prevFile);
      }
    }

    socket.join(currentFile);

    io.of(namespaceId).to(currentFile).emit(SocketEvents.SERVER_USER_JOINED_FILE, storedFileText);

  } catch (e) {
    console.log(e);
  }
};

exports.updateCode = async (data, socketId, namespaceId, socket, io) => {
  try {
    const { filename, startIdx, changeLength, changes } = data;

    if (!filename || !namespaceId)
      console.log("Nome do arquivo e a sala sao obrigatorios !");

    await redisClient.createConnection().then(async (client) => {
      await client.hget(namespaceId, filename, async (err, doc) => {
        if (err) console.log(err);

        const parsedCode = JSON.parse(doc);

        let loadFile = automerge.load(parsedCode);

        const parsedChanges = JSON.parse(changes);

        let changesApplied = automerge.applyChanges(loadFile, parsedChanges);

        const savedChanges = automerge.save(changesApplied);

        client.hset(namespaceId, filename, JSON.stringify(savedChanges));

        io.of(namespaceId).to(filename).except(socketId).emit(SocketEvents.SERVER_UPDATE_CODE, {
          changes: JSON.stringify(changes), // TODO -> Remove .stringfy and in client remove douple .parse
          startIdx,
          changeLength,
        });
      });
    })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
};


const getFileInMemory = (namespaceId, filename) => {
  let documentText = " ";

  return new Promise(async (resolve, reject) => {
    await redisClient.createConnection().then(async (client) => {
      await client.hget(namespaceId, filename, (err, doc) => {
        if (err) reject(err);

        documentText = doc;

        resolve(documentText);
      });
    }).catch((err) => {
      reject(err);
    })

  })

}

