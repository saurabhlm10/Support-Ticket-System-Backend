"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentByRole = void 0;
const User_1 = __importDefault(require("../../model/User"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    agents: [],
};
/**
+ * Retrieves a list of agents based on their role.
+ *
+ * @param {Request} req - The request object.
+ * @param {Response} res - The response object.
+ * @return {Promise<void>} The function does not return anything.
+ */
const getAgentByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentRole } = req.params;
    if (!agentRole) {
        responseObject.message = "Agent Role Is Missing";
        return res.status(401).json(responseObject);
    }
    const agentRoles = ["assignment", "chat", "email", "admin", "discord"];
    if (!agentRoles.includes(agentRole)) {
        responseObject.message = "Agent Role Is Invalid";
        return res.status(401).json(responseObject);
    }
    try {
        // const tempAgentList = await User.find({ role: agentRole }) as AgentWithoutPassword[]
        const agentList = (yield User_1.default.find({
            role: agentRole,
        }));
        console.log(agentList);
        responseObject.success = true;
        responseObject.message = "Agent List Fetched Successfully";
        responseObject.agents = agentList;
        return res.status(200).json(responseObject);
    }
    catch (error) {
        console.log(error);
        responseObject.agents = [];
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid agentRole" : error.message;
            return res.status(401).json(responseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(responseObject);
        }
    }
});
exports.getAgentByRole = getAgentByRole;
