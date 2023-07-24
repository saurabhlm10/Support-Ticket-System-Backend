"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getAgentByRole_1 = require("../controllers/agentController/getAgentByRole");
const getAllAgents_1 = require("../controllers/agentController/getAllAgents");
const getAgent_1 = require("../controllers/agentController/getAgent");
const getProfile_1 = require("../controllers/agentController/getProfile");
const router = express_1.default.Router();
router.get("/getAgentByRole/:agentRole", getAgentByRole_1.getAgentByRole);
router.get("/getAllAgents", getAllAgents_1.getAllAgents);
router.get("/getAgent/:userId", getAgent_1.getAgent);
router.get("/getprofile", getProfile_1.getProfile);
exports.default = router;
