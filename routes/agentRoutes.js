const express = require("express");
const { getAgentByRole } = require("../controllers/agentController/getAgentByRole");
const { getAllAgents } = require("../controllers/agentController/getAllAgents");
const router = express.Router();

router.get('/getAgentByRole/:agentRole', getAgentByRole)
router.get('/getAllAgents', getAllAgents)


module.exports = router;
