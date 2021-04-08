const express = require("express");
const router = express.Router();

const {
  createOrJoinRoom,
  checkForExistingNamespace,
  checkForExistingUsername,
} = require("../../services/user.service.js");


router.get("/join/:nspId/:username", async (req, res) => {
  let namespaceId = req.params.nspId;
  let username = req.params.username;

  await checkForExistingNamespace(namespaceId, async (result) => {

    if (result === false) return res.status(400).send("Essa sala não existe");

    await checkForExistingUsername(namespaceId, username, (result) => {
      if (result === true)
        return res.status(400).send("Esse username já está em uso");


      return res.status(201).send("ok");
    });

  });

});

module.exports = router;
