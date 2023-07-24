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
const { db } = require("../../lib/db");
exports.getChatsByIssueId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId } = req.params;
        console.log('Issue ID', issueId);
        const messages = yield db.zrange(`chat:${issueId}:messages`, 0, -1);
        res.status(200).json({
            success: true,
            message: 'Fetched Messages Successfully',
            messages
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Something Went Wrong'
        });
    }
});
