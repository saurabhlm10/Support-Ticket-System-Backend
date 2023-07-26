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
exports.getAgentOpenChats = void 0;
const Issue_1 = __importDefault(require("../../model/Issue"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    issues: [],
};
const getAgentOpenChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentEmail } = req.params;
    if (!agentEmail) {
        responseObject.message = "agentEmail Is Missing";
        return res.status(401).json(responseObject);
    }
    try {
        console.log(agentEmail);
        const openIssues = yield Issue_1.default.find({
            $or: [{ raiser: agentEmail }, { handler: agentEmail }],
            status: "pending",
        });
        // .populate("handler")
        // .exec()
        // .then((updatedResponse) => {
        //   if (updatedResponse) {
        //     // updatedResponse.forEach((item) => {
        //     //   item.handler.password = null;
        //     // });
        //     return updatedResponse;
        //   }
        // })
        // .catch((e) => {
        //   console.log(e);
        //   return [];
        // })) as IssueType[];
        console.log('openIssues', openIssues);
        responseObject.success = true;
        responseObject.message = "Agent Open Chats fetched successfully";
        responseObject.issues = openIssues;
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
exports.getAgentOpenChats = getAgentOpenChats;
