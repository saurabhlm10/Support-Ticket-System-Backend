"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cloudinary_1 = require("../utils/cloudinary");
const sendMessage_1 = require("../controllers/chatControllers/sendMessage");
const getChat_1 = require("../controllers/chatControllers/getChat");
const getChatsByIssueId_1 = require("../controllers/chatControllers/getChatsByIssueId");
const sendFile_1 = require("../controllers/chatControllers/sendFile");
router.post('/sendMessage', sendMessage_1.sendMessage);
router.post('/sendFile', cloudinary_1.upload.single('file'), sendFile_1.sendFile);
router.get('/getChat/:issueId', getChat_1.getChat);
router.get('/getChatsByIssueId/:issueId', getChatsByIssueId_1.getChatsByIssueId);
exports.default = router;
