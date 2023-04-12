const Issue = require("../../model/Issue")

exports.getAgentClosedChats = async (req, res) => {
    const { agentId } = req.params

    console.log(agentId)

    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        })
    }

    try {
        const response = await Issue.find({
            raiser: agentId,
            status: 'resolved'
        })

        res.status(200).json({
            success: true,
            message: 'Agent Closed Chats fetched successfully',
            response
        })
    } catch (error) {
        console.log(error)
    }

}