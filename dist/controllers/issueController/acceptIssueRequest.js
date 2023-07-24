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
exports.acceptIssueRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId, agentId } = req.params;
    if (!(issueId && agentId)) {
        return res.status(401).json({
            success: false,
            message: 'issueId or agentId Is Missing'
        });
    }
    const response = yield Issue.findByIdAndUpdate(issueId, {
        handler: agentId,
        potentialHandlers: [],
        status: 'pending'
    }, {
        new: true
    });
    return res.status(200).json({
        success: true,
        message: 'Issue Request Accepted successfully',
        response
    });
});
