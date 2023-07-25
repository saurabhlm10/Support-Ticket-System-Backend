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
exports.getChat = void 0;
const Chat_1 = __importDefault(require("../../model/Chat"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    chat: {},
};
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId } = req.params;
        if (!issueId) {
            responseObject.message = "Issue Id Is Missing";
            res.status(401).json(responseObject);
        }
        const chat = (yield Chat_1.default.findOne({ issueId }));
        if (!chat) {
            responseObject.message = "Chat Not Found";
            return res.status(402).json(responseObject);
        }
        responseObject.success = true;
        responseObject.message = "Chat Fetched Successfully";
        responseObject.chat = chat;
        return res.status(200).json(responseObject);
    }
    catch (error) {
        console.log(error);
        responseObject.chat = {};
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
exports.getChat = getChat;
