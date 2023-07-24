const Issue = require("../../model/Issue")

exports.quickSearchIssue = async (req, res) => {
    const { searchTerm } = req.params

    if (!searchTerm) {
        return res.status(401).json({
            success: false,
            message: 'searchTerm Is Missing'
        })
    }

    try {
        const searchResults = await Issue.find({ $or: [{ tokenId: new RegExp(searchTerm, 'i') }, { studentEmail: new RegExp(searchTerm, 'i') }, { studentPhone: new RegExp(searchTerm, 'i') }] })

        const openIssues = searchResults.filter(item => item.status === 'pending');
        const requestedIssues = searchResults.filter(item => item.status === 'not-assigned');
        const closedIssues = searchResults.filter(item => item.status === 'resolved');


        res.status(200).json({
            success: true,
            message: 'Fetched Search Results successfully',
            openIssues,
            requestedIssues,
            closedIssues
        })
        // res.status(200).json({
        //     success: true,
        //     message: 'Fetched Search Results successfully',
        //     searchResults
        // })

    } catch (error) {
        console.log(error)
    }
}