import express from "express";
import { getAgentByRole } from "../controllers/agentController/getAgentByRole";
import { getAllAgents } from "../controllers/agentController/getAllAgents";
import { getAgent } from "../controllers/agentController/getAgent";
import { getProfile } from "../controllers/agentController/getProfile";

const router = express.Router();

router.get("/getAgentByRole/:agentRole", getAgentByRole);
router.get("/getAllAgents", getAllAgents);
router.get("/getAgent/:userEmail", getAgent);
router.get("/getprofile", getProfile);

export default router;
