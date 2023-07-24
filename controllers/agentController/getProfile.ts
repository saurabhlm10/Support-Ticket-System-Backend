import jwt from 'jsonwebtoken'
import User from '../../model/User'
import { Request, Response } from 'express'

const jwtSecret = process.env.SECRET as string

export const getProfile = async (req: Request, res: Response) => {
    const token = req.cookies?.token

    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.status(200).json(userData)
        })
    } else {
        res.status(401).json('Token Missing')
    }
}

// exports.getAllProfiles = async (req, res) => {
//     const users = await User.find({}, { '_id': true, username: true });
//     res.json(users);
// }