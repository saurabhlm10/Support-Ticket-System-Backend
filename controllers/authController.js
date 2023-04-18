const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const {name, domain, role, email, password} = req.body

        // Check if all fields are provided
        if(!(name && role && domain && email && password)){
            return res.status(401).json({
              code: '401',
              message: 'All fields are required'
            })
        }

         // check if user already exists or not
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
        // throw new Error("User Already Exists")
        return res.status(402).json({
          code: '402',
          message: 'This Email Is Already Registered'
        });
      }

      // encrypt password
      const myEnPassword = bcrypt.hashSync(password, 10);

      // create a new entry in db
      const user = await User.create({
        name,
        role,
        domain,
        email,
        password: myEnPassword,
      });
  
      // create token and send it to user
      const token = jwt.sign(
        {
          id: user._id,
          email,
        },
        process.env.SECRET,
        { expiresIn: "24h" }
      );
  
      user.token = token;
  
      // dont want to send user to frontend
      user.password = undefined;
  
      res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user
    });


    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        // collect info 
        const {email, password} = req.body

        // validate
        if(!(email && password)){
            return res.status(401).json({
                code: '401',
                message: 'Email and Password are Required'
            })
        }

        // check if user exists
        const user = await User.findOne({email})

        if(!user){
            return res.status(402).json({
                code: '402',
                message: 'User Is Not Registered'
            })
        }

        // Check if password in correct
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(403).json({
                code: '403',
                message: 'Password Is Incorrect'
            })
        } 

        const token = jwt.sign(
            {
                id: user._id,
                email,
                role: user.role
            },
            process.env.SECRET,
            {
                expiresIn: '24h'
            }
        )

        user.password = undefined

        user.token = token

        return res.status(201).json({
            success: true,
            token,
            user
        })

    } catch (error) {
        console.log(error)
    }
}