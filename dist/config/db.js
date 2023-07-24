"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDb = () => {
    mongoose_1.default.connect(process.env.MONGO_URL)
        .then((conn) => {
        console.log(`connected to db at ${conn.connection.host}`);
    })
        .catch((error) => {
        console.log(error.message, "wrong password");
        process.exit(1);
    });
};
exports.default = connectToDb;
