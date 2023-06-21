const express = require("express");
const router = express.Router();

const { sendMessage } = require("../controllers/chatControllers/sendMessage");
const { getChat } = require("../controllers/chatControllers/getChat");

router.post('/sendMessage', sendMessage)
router.get('/getChat/:issueId', getChat)

module.exports = router;
