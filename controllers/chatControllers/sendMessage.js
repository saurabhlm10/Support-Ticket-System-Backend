const { pusherServer } = require("../../lib/pusher");

exports.sendMessage = (req, res) => {
    try {
        const { issueId, text, sender } = req.body

        if(!issueId) {
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

        pusherServer.trigger(issueId, "incoming-message", { text, sender, issueId });

        return res.status(200).json({
            success: true,
            message: "Message Sent Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Something Went Wrong" })
    }
}