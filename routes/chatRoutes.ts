const express = require("express");
const router = express.Router();
const { upload } = require('../utils/cloudinary');


const { sendMessage } = require("../controllers/chatControllers/sendMessage");
const { getChat } = require("../controllers/chatControllers/getChat");
const { getChatsByIssueId } = require("../controllers/chatControllers/getChatsByIssueId");
const { sendFile } = require("../controllers/chatControllers/sendFile");

router.post('/sendMessage', sendMessage)
router.post('/sendFile', upload.single('file'), sendFile)

router.get('/getChat/:issueId', getChat)
router.get('/getChatsByIssueId/:issueId', getChatsByIssueId)

module.exports = router;
