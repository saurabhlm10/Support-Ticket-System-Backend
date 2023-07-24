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
const User = require("../../model/User");
const Issue = require("../../model/Issue");
const { v4: uuidv4 } = require('uuid');
const Chat = require("../../model/Chat");
function generateUniqueId() {
    const uuid = uuidv4().replace(/-/g, '');
    return uuid.slice(0, 5);
}
function createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments) {
    return __awaiter(this, void 0, void 0, function* () {
        let tokenId = generateUniqueId();
        const status = handler ? "pending" : 'not-assigned';
        try {
            // Check if token ID already exists in the database
            while (yield Issue.exists({ tokenId })) {
                tokenId = generateUniqueId();
            }
            const newIssue = yield Issue.create({ tokenId, type, status, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments });
            console.log(newIssue);
            if (status === "pending") {
                const participants = [raiser, handler];
                yield Chat.create({
                    issueId: tokenId,
                    participants
                });
            }
            return newIssue;
        }
        catch (error) {
            return error.message;
        }
    });
}
exports.raiseIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { type } = req.params;
    // console.log(req.paymentReceiptImage)
    // console.log(req.file)
    // return res.status(200).json({
    //   files: req.files
    //   // paymentReceiptImage: req.paymentReceiptImage
    // })
    const issueTypes = ["no-access", "batch-change", "assignment", "other"];
    if (!issueTypes.includes(type)) {
        return res.status(402).json({
            success: false,
            message: "Please select a type of issue"
        });
    }
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description } = JSON.parse(req.body.options);
    console.log(req.body);
    let attachments = new Array();
    if ((type === 'no-access' || type === 'batch-change') && !info.paymentReceipt) {
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.paymentReceiptImage) {
            info.paymentReceipt = req.files.paymentReceiptImage[0].path;
        }
    }
    if (((_b = req.files) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        if (req.files['attachmentInput[]'] && req.files['attachmentInput[]'].length > 0) {
            req.files['attachmentInput[]'].forEach(attachment => {
                attachments.push(attachment.path);
            });
        }
    }
    if ((potentialHandlers === null || potentialHandlers === void 0 ? void 0 : potentialHandlers.length) < 1 && !handler) {
        return res.status(401).json({
            message: "There should be at least one potential handler or handler",
            success: false
        });
    }
    if (!(studentEmail && studentPhone && raiser && info)) {
        return res.status(401).json({
            message: "All fields are required",
            success: false
        });
    }
    const response = yield createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments);
    return res.status(201).json({
        success: true,
        message: "Issue created successfully",
        issue: response
    });
});
