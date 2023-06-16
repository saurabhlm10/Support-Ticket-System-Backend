const User = require('../../model/User')
 exports.getAgent = async(req, res) => {
    try {
        const {userId} = req.params

        console.log(userId)

        const agent = await User.findById(userId) 

        console.log(agent)

        res.status(200).json({
            success: true,
            agent,
            message: 'Fetched Agent Successfully'
        })


    } catch (error) {
        
    }
 }