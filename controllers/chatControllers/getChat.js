const Chat = require("../../model/Chat")

exports.getChat = async (req, res) => {
    try {
        const { issueId } = req.params

        if(!issueId) {
            res.status(401).json({
                success: false,
                message: "Issue Id Is Missing"
            })
        }

        const chat = await Chat.findOne({ issueId })

        if (!chat) {
            return res.status(402).json({
                success: false,
                message: 'Could Not Find Chat'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Chat fetched Successfully",
            chat
        })
    } catch (error) {
        res.status(400).send('Something Went Wrong')
    }
}