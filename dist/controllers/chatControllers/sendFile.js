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
const { fetchRedis } = require("../../helpers/fetchRedis");
const axios = require('axios');
const { pusherServer } = require("../../lib/pusher");
exports.sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, issueId, senderId, senderName, timestamp } = req.body;
        const message = {
            path: req.file.path.split('/'),
            filename,
            senderId,
            senderName,
            issueId,
            timestamp: Number(timestamp),
        };
        yield fetchRedis('zadd', `chat:${issueId}:messages`, timestamp, JSON.stringify(message));
        pusherServer.trigger(issueId, "incoming-message", message);
        res.status(200).json({
            success: true,
            message: 'File sent successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
});
