const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        let { name, domain, role, email, password } = req.body

        role = role.toLowerCase()
        domain = domain.toLowerCase()

        // Check if all fields are provided
        if (!(name && role && domain && email && password)) {
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
        // const token = jwt.sign(
        //     {
        //         id: user._id,
        //         email,
        //     },
        //     process.env.SECRET,
        //     { expiresIn: "24h" }
        // );

        jwt.sign({ userId: user._id, email }, process.env.SECRET, {}, (err, token) => {
            if (err) throw err;
            console.log('TOKEN', token)
            res.cookie('token', token, { secure: true }).status(201).json({
                id: user._id,
            });
        });


        // user.token = token;

        // dont want to send user to frontend
        // user.password = undefined;

        // res.status(201).json({
        //     success: true,
        //     message: "User Registered Successfully",
        //     user
        // });


    } catch (error) {
        console.log(error)
        if (err) throw err;
        res.status(500).json('error');
    }
}

exports.login = async (req, res) => {
    try {
        console.log('BACKEND LOGIN REACHED')
        // collect info 
        const { email, password } = req.body

        console.log(email, password)

        // validate
        if (!(email && password)) {
            return res.status(401).json({
                message: 'Email and Password are Required'
            })
        }

        // check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(402).json({
                message: 'User Is Not Registered'
            })
        }

        // Check if password in correct
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(403).json({
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
            token,
            user
        })

    } catch (error) {
        console.log(error)
    }
}