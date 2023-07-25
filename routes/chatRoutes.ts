import express from "express";
const router = express.Router();
import { upload } from '../utils/cloudinary';


import { sendMessage } from "../controllers/chatControllers/sendMessage";
import { getChat } from "../controllers/chatControllers/getChat";
import { getChatsByIssueId } from "../controllers/chatControllers/getChatsByIssueId";
import { sendFile } from "../controllers/chatControllers/sendFile";

router.post('/sendMessage', sendMessage)
router.post('/sendFile', upload.single('file'), sendFile)

router.get('/getChat/:issueId', getChat)
router.get('/getChatsByIssueId/:issueId', getChatsByIssueId)

export default router;
