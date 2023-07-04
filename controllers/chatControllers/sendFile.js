const { fetchRedis } = require("../../helpers/fetchRedis")
const axios = require('axios');
const { pusherServer } = require("../../lib/pusher");

exports.sendFile = async (req, res) => {
    try {

        const { filename, issueId, senderId, senderName, timestamp } = req.body

        const message = {
            path: req.file.path.split('/'),
            filename,
            senderId,
            senderName,
            issueId,
            timestamp: Number(timestamp),
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