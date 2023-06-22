const { Redis } = require('@upstash/redis')
exports.db = new Redis({
    // url: `${process.env.UPSTASH_REDIS_REST_URL}`,
    // token: `${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});