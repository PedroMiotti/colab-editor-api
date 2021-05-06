const express = require("express");
const router = express.Router();

const FileService = require("../../services/file.service");

router.post("/create", async (req, res) => {
  try {
    const { filename, namespaceId } = req.body;
    
    await FileService.createFile(filename, namespaceId);

    return res.status(200).send("Arquivo criado com sucesso !");
  } catch (e) {
    return res.status(400).send("Erro ao criar o arquivo :" + e);
  }
});

module.exports = router;
