const express = require("express");
const router = express.Router();

const { raiseIssue } = require("../controllers/issueController/raiseIssue");

router.post("/raiseIssue/:type", raiseIssue);

module.exports = router;
