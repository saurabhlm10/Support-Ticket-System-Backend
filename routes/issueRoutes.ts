import express from "express";
const router = express.Router();

import { raiseIssue } from "../controllers/issueController/raiseIssue";
import { getAgentOpenChats } from "../controllers/issueController/getAgentOpenChats";
import { getAgentClosedChats } from "../controllers/issueController/getAgentClosedChats";
import { getAgentRequestedChats } from "../controllers/issueController/getAgentRequestedChats";
import { closeIssue } from "../controllers/issueController/closeIssue";
import { quickSearchIssue } from "../controllers/issueController/quickSearchIssue";
import { acceptIssueRequest } from "../controllers/issueController/acceptIssueRequest";
import { filterIssues } from "../controllers/issueController/filterIssues";
import { upload } from '../utils/cloudinary';

// router.post("/raiseIssue/:type", upload.single('paymentReceiptImage'), upload.array('attachmentInput'),raiseIssue);
// router.post("/raiseIssue/:type", upload.array('attachmentInput[]'), raiseIssue);
router.post("/raiseIssue/:type",
    upload.fields([
        { name: 'paymentReceiptImage' },
        { name: 'attachmentInput[]', maxCount: 30 }
    ]),
    // upload.single('paymentReceiptImage'),
    raiseIssue);


router.get('/chats/open/:agentEmail', getAgentOpenChats)
router.get('/chats/requested/:agentEmail', getAgentRequestedChats)
router.get('/chats/closed/:agentEmail', getAgentClosedChats)
router.post('/closeIssue/:issueId', closeIssue)
router.get('/searchIssue/:searchTerm', quickSearchIssue)
router.post('/acceptIssueRequest/:issueId/:agentEmail', acceptIssueRequest)
router.post('/filterIssues', filterIssues)



export default router;
