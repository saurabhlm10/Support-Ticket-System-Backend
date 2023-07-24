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
const Issue = require("../../model/Issue");
exports.getAgentRequestedChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        });
    }
    try {
        const requestedIssues = yield Issue.find({
            raiser: agentId,
            status: 'not-assigned'
        })
            .populate('potentialHandlers').exec()
            .then((updatedResponse) => {
            updatedResponse.forEach((itemArray) => {
                itemArray.potentialHandlers.forEach((item) => {
                    item.password = null;
                });
            });
            return updatedResponse;
        })
            .catch((e) => {
            console.log(e);
        });
        res.status(200).json({
            success: true,
            message: 'Agent Open and Requested chats fetched successfully',
            requestedIssues
        });
    }
    catch (error) {
        console.log(error);
    }
});
