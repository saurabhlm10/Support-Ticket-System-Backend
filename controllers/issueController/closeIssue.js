const Issue = require("../../model/Issue")

exports.closeIssue = async (req, res) => {
    const {issueId} = req.params

    if (!issueId) {
        return res.status(401).json({
            success: false,
            message: 'issueId Is Missing'
        })
    }

    try {
        const response = await Issue.findByIdAndUpdate(issueId, {status: 'resolved'}, {
            new: true
        })

        res.status(200).json({
            success: true,
            message: 'Issue Resolved successfully',
            response
        })

    } catch (error) {
        console.log(error)
    }
}