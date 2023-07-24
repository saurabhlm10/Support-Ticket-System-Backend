const { db } = require("../../lib/db")

exports.getChatsByIssueId = async (req, res) => {
    try {
        const { issueId } = req.params

        console.log('Issue ID', issueId)

        const messages = await db.zrange(`chat:${issueId}:messages`, 0, -1)
        

        res.status(200).json({
            success: true,
            message: 'Fetched Messages Successfully',
            messages
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: 'Something Went Wrong'
        })
    }
}