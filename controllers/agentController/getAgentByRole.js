const User = require('../../model/User')

exports.getAgentByRole = async (req, res) => {
    const { agentRole } = req.params

    if (!agentRole) {
        return res.status(401).json({
            success: false,
            message: 'AgentRole is Missing'
        })
    }

    const agentRoles = ["assignment", "chat", "email", "admin", "discord"]

    if (!agentRoles.includes(agentRole)) {
        return res.status(402).json({
            success: false,
            message: 'Agent Role Is Invalid'
        })
    }

    try {
        const tempAgentList = await User.find({ role: agentRole })

        const agentList = new Array()

        tempAgentList.forEach(agent => {
            console.log(agent); agent.password = null
            agentList.push(agent)
        })

        console.log(agentList)
        return res.status(200).json({
            success: true,
            message: 'Agent List fetched successfully',
            agentList
        })
    } catch (error) {
        console.log(error)
    }
}