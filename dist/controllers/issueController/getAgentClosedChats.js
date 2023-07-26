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
exports.getAgentClosedChats = void 0;
const Issue_1 = __importDefault(require("../../model/Issue"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    issues: [],
};
const getAgentClosedChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentEmail } = req.params;
    if (!agentEmail) {
        responseObject.message = "agentEmail Is Missing";
        return res.status(401).json(responseObject);
    }
    try {
        const closedIssues = (yield Issue_1.default.find({
            raiser: agentEmail,
            status: "resolved",
        })
            .populate("handler")
            .exec()
            .then((updatedClosedIssues) => {
            // updatedClosedIssues.forEach((item) => {
            //   item.handler.password = null;
            // });
            return updatedClosedIssues;
        })
            .catch((e) => {
            console.log(e);
            return [];
        }));
        responseObject.success = true;
        responseObject.message = "Agent Closed Chats fetched successfully";
        responseObject.issues = closedIssues;
        res.status(200).json(responseObject);
    }
    catch (error) {
        console.log(error);
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid Ids" : error.message;
            return res.status(401).json(responseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(responseObject);
        }
    }
});
exports.getAgentClosedChats = getAgentClosedChats;
