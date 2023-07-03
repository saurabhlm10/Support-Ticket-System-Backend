const { fetchRedis } = require("../../helpers/fetchRedis")
const axios = require('axios');
const { pusherServer } = require("../../lib/pusher");

const upstashRedRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

exports.sendFile = async (req, res) => {
    try {

        const { filename, issueId, senderId, senderName } = req.body

        const timestamp = Date.now();

        const message = {
            // path: req.file.path.replace(/\//g, '-'),
            path: req.file.path.split('/'),
            filename,
            senderId,
            senderName,
            issueId,
            timestamp,
        };

        await fetchRedis('zadd', `chat:${issueId}:messages`, timestamp, JSON.stringify(message))

        pusherServer.trigger(issueId, "incoming-message", message)

        res.status(200).json({
            success: true,
            message: 'File sent successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Something Went Wrong" })
    }
}