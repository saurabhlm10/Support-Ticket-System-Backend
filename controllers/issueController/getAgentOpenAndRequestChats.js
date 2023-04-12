const Issue = require("../../model/Issue")

exports.getAgentOpenAndRequestChats = async (req, res) => {
    const { agentId } = req.params

    console.log(agentId)

    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        })
    }

    try {
        console.log('reached')
        const response = await Issue.find({
            raiser: agentId,
            status: { $in: ["pending", "not-assigned"] }
        })

        res.status(200).json({
            success: true,
            message: 'Agent Open and Requested chats fetched successfully',
            response
        })
    } catch (error) {
        console.log(error)
    }

}