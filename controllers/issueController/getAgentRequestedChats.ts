const Issue = require("../../model/Issue")

exports.getAgentRequestedChats = async (req, res) => {
    const { agentId } = req.params

    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        })
    }

    try {
        const requestedIssues = await Issue.find({
            raiser: agentId,
            status: 'not-assigned'
        })
            .populate('potentialHandlers').exec()
            .then((updatedResponse) => {
                updatedResponse.forEach((itemArray) => {
                    itemArray.potentialHandlers.forEach((item) => {
                        item.password = null
                    })
                })
                return updatedResponse
            })
            .catch((e) => {
                console.log(e)
            })

        res.status(200).json({
            success: true,
            message: 'Agent Open and Requested chats fetched successfully',
            requestedIssues
        })
    } catch (error) {
        console.log(error)
    }

}