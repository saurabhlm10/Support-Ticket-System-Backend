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
exports.sendFile = void 0;
const mongoose_1 = require("mongoose");
const fetchRedis_1 = require("../../helpers/fetchRedis");
const pusher_1 = require("../../lib/pusher");
const responseObject = {
    success: false,
    message: "",
};
const sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { filename, issueId, senderId, senderName, timestamp } = req.body;
        if (!(filename && issueId && senderId && senderName && timestamp)) {
            responseObject.message = "All fields are Required";
            return res.status(401).json(responseObject);
        }
        const path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.split("/");
        const message = {
            path,
            filename,
            senderId,
            senderName,
            issueId,
            timestamp: Number(timestamp),
        };
        yield (0, fetchRedis_1.fetchRedis)("zadd", `chat:${issueId}:messages`, timestamp, JSON.stringify(message));
        pusher_1.pusherServer.trigger(issueId, "incoming-message", message);
        responseObject.success = true;
        responseObject.message = "File Sent Successfully";
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
exports.sendFile = sendFile;
