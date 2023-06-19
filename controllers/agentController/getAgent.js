const User = require('../../model/User')
 exports.getAgent = async(req, res) => {
    try {
        const {userId} = req.params

        console.log(userId)

        const agent = await User.findById(userId) 

        agent.password = undefined

        res.status(200).json({
            success: true,
            agent,
            message: 'Fetched Agent Successfully'
        })


    } catch (error) {
        console.log(error)
    }
 }