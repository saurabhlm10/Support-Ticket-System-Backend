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
exports.getAgent = void 0;
const User_1 = __importDefault(require("../../model/User"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    agent: {},
};
const getAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            responseObject.message = "User Id Is Missing";
            return res.status(401).json(responseObject);
        }
        const agent = (yield User_1.default.findById(userId));
        if (!agent) {
            responseObject.message = "Agent Not Found";
            return res.status(401).json(responseObject);
        }
        responseObject.success = true;
        responseObject.message = "Agent Fetched Successfully";
        responseObject.agent = agent;
        res.status(200).json(responseObject);
    }
    catch (error) {
        console.log(error);
        responseObject.agent = {};
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid UserId" : error.message;
            return res.status(401).json(responseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(responseObject);
        }
    }
});
exports.getAgent = getAgent;
