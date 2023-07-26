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
exports.raiseIssue = void 0;
const Issue_1 = __importDefault(require("../../model/Issue"));
const uuid_1 = require("uuid");
const Chat_1 = __importDefault(require("../../model/Chat"));
// import { IssueType } from "../../types/Issue";
const mongoose_1 = require("mongoose");
function generateUniqueId() {
    const uuid = (0, uuid_1.v4)().replace(/-/g, "");
    return uuid.slice(0, 5);
}
function createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments) {
    return __awaiter(this, void 0, void 0, function* () {
        let tokenId = generateUniqueId();
        const status = handler ? "pending" : "not-assigned";
        console.log("3");
        try {
            // Check if token ID already exists in the database
            while (yield Issue_1.default.exists({ tokenId })) {
                tokenId = generateUniqueId();
            }
            const newIssue = (yield Issue_1.default.create({
                tokenId,
                type,
                status,
                studentEmail,
                studentPhone,
                raiser,
                potentialHandlers,
                handler,
                info,
                description,
                attachments,
            }));
            console.log(newIssue);
            if (status === "pending") {
                const participants = [raiser, handler];
                yield Chat_1.default.create({
                    issueId: tokenId,
                    participants,
                });
            }
            console.log("4");
            return newIssue;
        }
        catch (error) {
            console.log('ERROR');
            console.log(error);
            if (error instanceof mongoose_1.MongooseError) {
                let message = error.name === "CastError" ? "Invalid Ids" : error.message;
                return message;
            }
            if (error instanceof Error) {
                let message = error.message;
                return message;
            }
        }
    });
}
const responseObject = {
    success: false,
    message: "",
    issue: {},
};
const raiseIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { type } = req.params;
    if (!type) {
        responseObject.message = "type Is Missing";
        return res.status(401).json(responseObject);
    }
    const issueTypes = ["no-access", "batch-change", "assignment", "other"];
    if (!issueTypes.includes(type)) {
        return res.status(402).json({
            success: false,
            message: "Please select a type of issue",
        });
    }
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, } = JSON.parse(((_a = req.body) === null || _a === void 0 ? void 0 : _a.options) || {});
    console.log("BODY", JSON.parse(req.body.options));
    let attachments = new Array();
    console.log("121");
    if ((type === "no-access" || type === "batch-change") &&
        !info.paymentReceipt) {
        console.log("first");
        // debug it
        if (req.files
            .paymentReceiptImage) {
            info.paymentReceipt = req.files.paymentReceiptImage[0].path;
        }
    }
    console.log("137");
    // if (req.files?.length > 0) {
    //   if (
    //     req.files["attachmentInput[]"] &&
    //     req.files["attachmentInput[]"].length > 0
    //   ) {
    //     req.files["attachmentInput[]"].forEach((attachment: any) => {
    //       attachments.push(attachment.path);
    //     });
    //   }
    // }
    console.log("req.files", req.files);
    console.log("req.files", req.files);
    if (((_b = req.files) === null || _b === void 0 ? void 0 : _b.length) &&
        req.files["attachmentInput[]"] &&
        req.files["attachmentInput[]"].length > 0) {
        console.log("entered");
        req.files["attachmentInput[]"].forEach((attachment) => {
            attachments.push(attachment.path);
        });
    }
    console.log("0");
    if ((potentialHandlers === null || potentialHandlers === void 0 ? void 0 : potentialHandlers.length) < 1 && !handler) {
        responseObject.message = "At least one potential handler is required";
        return res.status(401).json(responseObject);
    }
    if (!(studentEmail && studentPhone && raiser && info)) {
        responseObject.message = "All fields are required";
        return res.status(401).json(responseObject);
    }
    console.log("1");
    const response = yield createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments);
    console.log("2");
    responseObject.success = true;
    responseObject.message = "Issue Raised successfully";
    responseObject.issue = response;
    return res.status(200).json(responseObject);
});
exports.raiseIssue = raiseIssue;
