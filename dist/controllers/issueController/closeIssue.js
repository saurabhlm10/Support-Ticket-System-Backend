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
exports.closeIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params;
    if (!issueId) {
        return res.status(401).json({
            success: false,
            message: 'issueId Is Missing'
        });
    }
    try {
        const response = yield Issue.findByIdAndUpdate(issueId, { status: 'resolved' }, {
            new: true
        });
        res.status(200).json({
            success: true,
            message: 'Issue Resolved successfully',
            response
        });
    }
    catch (error) {
        console.log(error);
    }
});
