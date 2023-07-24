const Issue = require("../../model/Issue")

exports.getAgentClosedChats = async (req, res) => {
    const { agentId } = req.params

    if (!agentId) {
        return res.status(401).json({
            success: false,
            message: 'AgentId Is Missing'
        })
    }

    try {
        const closedIssues = await Issue.find({
            raiser: agentId,
            status: 'resolved'
        })
        .populate('handler').exec()
            .then((updatedClosedIssues) => {
                updatedClosedIssues.forEach((item) => {
                    item.handler.password = null
                })

                return updatedClosedIssues
                
            })
            .catch((e) => {
                console.log(e)
            })

        res.status(200).json({
            success: true,
            message: 'Agent Closed Chats fetched successfully',
            closedIssues
        })
    } catch (error) {
        console.log(error)
    }

}