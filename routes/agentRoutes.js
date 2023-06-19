const express = require("express");
const { getAgentByRole } = require("../controllers/agentController/getAgentByRole");
const { getAllAgents } = require("../controllers/agentController/getAllAgents");
const { getAgent } = require("../controllers/agentController/getAgent");
const { getProfile } = require("../controllers/agentController/getProfile");
const router = express.Router();

router.get('/getAgentByRole/:agentRole', getAgentByRole)
router.get('/getAllAgents', getAllAgents)
router.get('/getAgent/:userId', getAgent)
router.get('/getprofile', getProfile)


module.exports = router;
