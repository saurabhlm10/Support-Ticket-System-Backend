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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatsByIssueId = void 0;
const db_1 = require("../../lib/db");
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    messages: [],
};
const getChatsByIssueId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId } = req.params;
        if (!issueId) {
            responseObject.message = "Issue Id Is Missing";
            res.status(401).json(responseObject);
        }
        const messages = (yield db_1.db.zrange(`chat:${issueId}:messages`, 0, -1));
        responseObject.success = true;
        responseObject.message = "Messages Fetched Successfully";
        responseObject.messages = messages;
        res.status(200).json(responseObject);
    }
    catch (error) {
        console.log(error);
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid issueId" : error.message;
            return res.status(401).json(responseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(responseObject);
        }
    }
});
exports.getChatsByIssueId = getChatsByIssueId;
