const User = require('../../model/User')

exports.getAllAgents = async (req, res) => {
    try {
        const tempAllAgentsList = await User.find()

        const allAgentsList = new Array()


        tempAllAgentsList.forEach(agent => {
            console.log(agent); agent.password = null
            allAgentsList.push(agent)
        })

        res.status(200).json({
            success: true,
            message: 'All Agents List Fetched successfully',
            allAgentsList
        })


    } catch (error) {
        console.log(error)
    }
}