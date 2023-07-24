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
    raiseIssue);


router.get('/chats/open/:agentId', getAgentOpenChats)
router.get('/chats/requested/:agentId', getAgentRequestedChats)
router.get('/chats/closed/:agentId', getAgentClosedChats)
router.post('/closeIssue/:issueId', closeIssue)
router.get('/searchIssue/:searchTerm', quickSearchIssue)
router.post('/acceptIssueRequest/:issueId/:agentId', acceptIssueRequest)
router.post('/filterIssues', filterIssues)


router.post('/upload', upload.single('paymentReceipt'), function (req, res) {
    // res.send('File uploaded successfully.');

    console.log(req.files)
    // console.log(req.body.otherFields)
    const imageUrls = req.files.map(file => file.path);
    imageUrls.forEach(element => {
        console.log(element)
    });
    res.send(`Uploaded images: ${imageUrls.join(', ')}`);
});


module.exports = router;
