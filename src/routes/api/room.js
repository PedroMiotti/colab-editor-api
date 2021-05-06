const express = require("express");
const router = express.Router();

const RoomService = require("../../services/room.service");


router.get("/join/:nspId/:username", async (req, res) => {
  let namespaceId = req.params.nspId;
  let username = req.params.username;

  await RoomService.checkForExistingNamespace(namespaceId, async (result) => {

    if (result === false) return res.status(400).send("Essa sala não existe");

    await RoomService.checkForExistingUsername(namespaceId, username, (result) => {
      if (result === true)
        return res.status(400).send("Esse username já está em uso");

      return res.status(201).send("ok");
    });

  });

});

module.exports = router;
