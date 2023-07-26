"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    issueId: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 5,
    },
    participants: {
        type: [String],
        ref: "User",
        required: true,
        default: [],
    },
}, {
    timestamps: true,
});
const Chat = mongoose_1.default.model("Chat", ChatSchema);
exports.default = Chat;
