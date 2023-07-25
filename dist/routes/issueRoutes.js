"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const raiseIssue_1 = require("../controllers/issueController/raiseIssue");
const getAgentOpenChats_1 = require("../controllers/issueController/getAgentOpenChats");
const getAgentClosedChats_1 = require("../controllers/issueController/getAgentClosedChats");
const getAgentRequestedChats_1 = require("../controllers/issueController/getAgentRequestedChats");
const closeIssue_1 = require("../controllers/issueController/closeIssue");
const quickSearchIssue_1 = require("../controllers/issueController/quickSearchIssue");
const acceptIssueRequest_1 = require("../controllers/issueController/acceptIssueRequest");
const filterIssues_1 = require("../controllers/issueController/filterIssues");
const cloudinary_1 = require("../utils/cloudinary");
// router.post("/raiseIssue/:type", upload.single('paymentReceiptImage'), upload.array('attachmentInput'),raiseIssue);
// router.post("/raiseIssue/:type", upload.array('attachmentInput[]'), raiseIssue);
router.post("/raiseIssue/:type", cloudinary_1.upload.fields([
    { name: 'paymentReceiptImage' },
    { name: 'attachmentInput[]', maxCount: 30 }
]), 
// upload.single('paymentReceiptImage'),
raiseIssue_1.raiseIssue);
router.get('/chats/open/:agentId', getAgentOpenChats_1.getAgentOpenChats);
router.get('/chats/requested/:agentId', getAgentRequestedChats_1.getAgentRequestedChats);
router.get('/chats/closed/:agentId', getAgentClosedChats_1.getAgentClosedChats);
router.post('/closeIssue/:issueId', closeIssue_1.closeIssue);
router.get('/searchIssue/:searchTerm', quickSearchIssue_1.quickSearchIssue);
router.post('/acceptIssueRequest/:issueId/:agentId', acceptIssueRequest_1.acceptIssueRequest);
router.post('/filterIssues', filterIssues_1.filterIssues);
exports.default = router;
