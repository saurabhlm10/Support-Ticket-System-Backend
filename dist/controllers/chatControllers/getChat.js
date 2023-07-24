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
const Chat = require("../../model/Chat");
exports.getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId } = req.params;
        if (!issueId) {
            res.status(401).json({
                success: false,
                message: "Issue Id Is Missing"
            });
        }
        const chat = yield Chat.findOne({ issueId });
        if (!chat) {
            return res.status(402).json({
                success: false,
                message: 'Could Not Find Chat'
            });
        }
        return res.status(200).json({
            success: true,
            message: "Chat fetched Successfully",
            chat
        });
    }
    catch (error) {
        res.status(400).send('Something Went Wrong');
    }
});
