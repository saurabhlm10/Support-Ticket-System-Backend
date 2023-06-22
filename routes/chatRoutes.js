const express = require("express");
const router = express.Router();

const { sendMessage } = require("../controllers/chatControllers/sendMessage");
const { getChat } = require("../controllers/chatControllers/getChat");
const { getChatsByIssueId } = require("../controllers/chatControllers/getChatsByIssueId");

router.post('/sendMessage', sendMessage)
router.get('/getChat/:issueId', getChat)
router.get('/getChatsByIssueId/:issueId', getChatsByIssueId)

module.exports = router;
