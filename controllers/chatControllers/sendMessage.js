const { fetchRedis } = require("../../helpers/fetchRedis");
const { db } = require("../../lib/db");
const { pusherServer } = require("../../lib/pusher");

exports.sendMessage = async (req, res) => {
    try {
        const { issueId, text, senderId, senderName } = req.body

        if (!issueId) {
            return res.status(401).json({
                success: false,
                message: "Issue Id Is Missing"
            })
        }

        if (!text) {
            return res.status(401).json({
                success: false,
                message: "Text Cannot Be Empty"
            })
        }

        const timestamp = Date.now()

        const message = {
            score: timestamp,
            member: JSON.stringify({ text, senderId, senderName, issueId, timestamp }),
        }

        pusherServer.trigger(issueId, "incoming-message", { text, senderId, senderName, issueId, timestamp });

        // await db.zadd(`chat:${issueId}:messages`, {
        //     score: timestamp,
        //     member: JSON.stringify({ text, senderId, senderName, issueId, timestamp }),
        // });

        // await fetchRedis('zadd', `chat:${issueId}:messages`, timestamp, JSON.stringify({ text, senderId, senderName, issueId, timestamp }))


        return res.status(200).json({
            success: true,
            message: "Message Sent Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Something Went Wrong" })
    }
}