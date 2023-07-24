const Issue = require("../../model/Issue")

exports.acceptIssueRequest = async (req, res) => {
    const { issueId, agentId } = req.params

    if (!(issueId && agentId)) {
        return res.status(401).json({
            success: false,
            message: 'issueId or agentId Is Missing'
        })
    }

    const response = await Issue.findByIdAndUpdate(issueId, {
        handler: agentId,
        potentialHandlers: [],
        status: 'pending'
    }, {
        new: true
    })

    return res.status(200).json({
        success: true,
        message: 'Issue Request Accepted successfully',
        response
    })
}