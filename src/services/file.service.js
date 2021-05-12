const SocketEvents = require("../constants/socketEvents");

const { RoomModel } = require("../models/index");

const automerge = require("automerge");

const DEFAULT_PROGRAM = "// Insert code here";

exports.createFile = async (fileName, namespaceId, io) => {
  try {
    if (!fileName || !namespaceId)
      console.log("Nome do arquivo e a sala sao obrigatorios !");

    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    if (!room) console.log("Sala nao existe");

    let doc = automerge.init();
    doc = automerge.change(doc, docRef => {
        docRef.content = new automerge.Text();
        docRef.content.insertAt(0, ...DEFAULT_PROGRAM.split(""));
      });

    let new_file = { filename: fileName, text: JSON.stringify(automerge.save(doc)) };

    room.files.push(new_file);
    room = await room.save();

    io.of(namespaceId).emit(SocketEvents.SERVER_UPDATE_FILES, {
      files: room.files,
    });

  } catch (e) {
    console.log(e);
  }
};

exports.joinFile = async (
  prevFile,
  currentFile,
  namespaceId,
  socketId,
  socket,
  io
) => {
  try {
    if (!currentFile || !namespaceId)
      console.log("Nome do arquivo e a sala sao obrigatorios !");

    let room = await RoomModel.findOne({ namespaceId: namespaceId });

    let file = await RoomModel.find({
      namespaceId: namespaceId,
      "files.filename": currentFile,
    });

    if (!room) console.log("Sala nao existe");

    let socket_rooms = io.of(namespaceId).adapter.rooms;
    // Check if user is already inside a room that is not the default.
    for (let [key, value] of socket_rooms) {
      if (key !== socketId && value.has(socketId)) {
        socket.leave(prevFile);
      }
    }

    socket.join(currentFile);

    io.of(namespaceId).to(currentFile).emit(SocketEvents.SERVER_USER_JOINED_FILE, file[0].files[0].text);

  } catch (e) {
    console.log(e);
  }
};

exports.updateCode = async (
  data,
  socketId,
  namespaceId,
  socket,
  io
) => {
  try {

    const { filename, startIdx, changeLength, changes } = data;

    if (!filename || !namespaceId)
      console.log("Nome do arquivo e a sala sao obrigatorios !");

    let room = await RoomModel.find({
      namespaceId: namespaceId,
      "files.filename": filename,
    });

    const parsedCode = JSON.parse(room[0].files[0].text);
    const codeParsedValues = Object.values(parsedCode);
    const newCodeArr = new Uint8Array(codeParsedValues);
    
    let loadFile = automerge.load(newCodeArr);
    
    const changesArray = [];
    const parsedChanges = JSON.parse(changes); 
    const changesParsedValues = Object.values(parsedChanges[0]);
    const newChangesArr = new Uint8Array(changesParsedValues);
    changesArray.push(newChangesArr)

    // Testing -- Why is returning empty object ? Shoudnt return a object with changes ?
    let loadFile1 = automerge.load(newChangesArr);
    console.log(loadFile1) 
    
    loadFile = automerge.applyChanges(loadFile, changesArray);
    
    const savedChanges = automerge.save(loadFile[0]);
    

    let updateFileText = await RoomModel.findOneAndUpdate({
      namespaceId: namespaceId,
      "files.filename": filename,
    }, { text: savedChanges } );

    await updateFileText.save();

    io.of(namespaceId).to(filename).except(socketId).emit(SocketEvents.SERVER_UPDATE_CODE, {
      changes: JSON.stringify(changes), 
      startIdx,
      changeLength
    });

  } catch (e) {
    console.log(e);
  }
};























