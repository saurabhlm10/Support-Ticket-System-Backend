const express = require("express");
const router = express.Router();

const { raiseIssue } = require("../controllers/issueController/raiseIssue");
const { getAgentOpenAndRequestChats } = require("../controllers/issueController/getAgentOpenAndRequestChats");
const { getAgentClosedChats } = require("../controllers/issueController/getAgentClosedChats");
const { closeIssue } = require("../controllers/issueController/closeIssue");
const { quickSearchIssue } = require("../controllers/issueController/quickSearchIssue");
const { acceptIssueRequest } = require("../controllers/issueController/acceptIssueRequest");

const { upload } = require('../utils/cloudinary')

router.post("/raiseIssue/:type", raiseIssue);
router.get('/chats/:agentId', getAgentOpenAndRequestChats)
router.get('/chats/closed/:agentId', getAgentClosedChats)
router.post('/closeIssue/:issueId', closeIssue)
router.get('/searchIssue/:searchTerm', quickSearchIssue)
router.post('/acceptIssueRequest/:issueId/:agentId', acceptIssueRequest)
router.post('/upload', upload.array('files'), function (req, res) {
    // res.send('File uploaded successfully.');
    console.log(req.files)
    console.log(req.body.otherFields)
    const imageUrls = req.files.map(file => file.path);
    imageUrls.forEach(element => {
        console.log(element)
    });
    res.send(`Uploaded images: ${imageUrls.join(', ')}`);
});


module.exports = router;
