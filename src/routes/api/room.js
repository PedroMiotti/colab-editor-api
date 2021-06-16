const express = require("express");
const router = express.Router();

const RoomService = require("../../services/room.service");


router.get("/join/:nspId/:username", async (req, res) => {
  let namespaceId = req.params.nspId;
  let username = req.params.username;

  try{
    let room_exists = await RoomService.checkForExistingRoom(namespaceId);

    let username_exists = await RoomService.checkForExistingUsername(namespaceId, username);

    if(room_exists.length === 0){
      return res.status(400).send("Essa sala não existe")
    }

    if(!(username_exists === -1)){
      return res.status(400).send("Esse nome de usuario já está em uso nessa sala");
    }

    return res.status(200).send("Usuario entrou na sala !");

  }
  catch(e){
    return res.status(400).send("Erro :" + e);
  }
});



module.exports = router;
