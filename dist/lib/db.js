"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const redis_1 = require("@upstash/redis");
// Assuming you have set the process.env.UPSTASH_REDIS_REST_URL and process.env.UPSTASH_REDIS_REST_TOKEN variables
// Create a Requester object with the necessary properties
const requester = {
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "", // Providing a default empty string for the token
};
// Pass the requester object to the Redis constructor
exports.db = new redis_1.Redis(requester);
