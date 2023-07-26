"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const issueSchema = new mongoose_1.default.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 5,
    },
    type: {
        type: String,
        enum: ["assignment", "batch-change", "no-access", "other"],
        required: true,
    },
    status: {
        type: String,
        enum: ["not-assigned", "pending", "resolved"],
        required: true,
    },
    studentEmail: {
        type: String,
        required: true,
    },
    studentPhone: {
        type: String,
        required: true,
    },
    raiser: {
        type: String,
        required: true,
    },
    potentialHandlers: {
        type: [String],
    },
    handler: {
        type: String,
        default: "",
    },
    info: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    chats: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
    },
    attachments: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
const Issue = mongoose_1.default.model("Issue", issueSchema);
exports.default = Issue;
