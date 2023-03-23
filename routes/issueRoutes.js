const express = require("express");
const router = express.Router();

const { noAccess, batchChange, assignment } = require("../controllers/issueController/raiseIssue");

router.post("/raiseIssue/no-access", noAccess);
router.post("/raiseIssue/batch-change", batchChange);
router.post("/raiseIssue/assignment", assignment);

module.exports = router;
