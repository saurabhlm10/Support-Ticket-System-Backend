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
exports.getAgentClosedChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        });
    }
    try {
        const closedIssues = yield Issue.find({
            raiser: agentId,
            status: 'resolved'
        })
            .populate('handler').exec()
            .then((updatedClosedIssues) => {
            updatedClosedIssues.forEach((item) => {
                item.handler.password = null;
            });
            return updatedClosedIssues;
        })
            .catch((e) => {
            console.log(e);
        });
        res.status(200).json({
            success: true,
            message: 'Agent Closed Chats fetched successfully',
            closedIssues
        });
    }
    catch (error) {
        console.log(error);
    }
});
