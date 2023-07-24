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
const { db } = require("../../lib/db");
const { pusherServer } = require("../../lib/pusher");
exports.sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId, text, senderId, senderName, timestamp } = req.body;
        console.log(req.body);
        if (!issueId) {
            return res.status(401).json({
                success: false,
                message: "Issue Id Is Missing"
            });
        }
        if (!text) {
            return res.status(401).json({
                success: false,
                message: "Text Cannot Be Empty"
            });
        }
        const message = {
            text,
            senderId,
            senderName,
            issueId,
            timestamp,
        };
        yield fetchRedis("zadd", `chat:${issueId}:messages`, timestamp, JSON.stringify(message));
        pusherServer.trigger(issueId, "incoming-message", { text, senderId, senderName, issueId, timestamp });
        // await db.zadd(`chat:${issueId}:messages`, {
        //     score: timestamp,
        //     member: JSON.stringify({ text, senderId, senderName, issueId, timestamp }),
        // });
        // await fetchRedis('zadd', `chat:${issueId}:messages`, timestamp, JSON.stringify({ text, senderId, senderName, issueId, timestamp }))
        return res.status(200).json({
            success: true,
            message: "Message Sent Successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
});
