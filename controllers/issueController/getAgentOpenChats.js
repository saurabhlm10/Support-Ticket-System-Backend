const Issue = require("../../model/Issue")

exports.getAgentOpenChats = async (req, res) => {
    const { agentId } = req.params

    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        })
    }

    try {
        const openIssues = await Issue.find({
            raiser: agentId,
            status: 'pending'
        })
            .populate('handler').exec()
            .then((updatedResponse) => {
                if (updatedResponse) {
                    updatedResponse.forEach((item) => {
                        item.handler.password = null
                    })
                    return updatedResponse
                }
            }

            )
            .catch((e) => {
                console.log(e)
            })

        res.status(200).json({
            success: true,
            message: 'Agent Open and Requested chats fetched successfully',
            openIssues
        })
    } catch (error) {
        console.log(error)
    }

}