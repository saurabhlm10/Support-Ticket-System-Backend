import { Request, Response } from "express";

import User from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongooseError, Types } from "mongoose";
import { Agent } from "../types/Agent";

interface RegisterResponse {
  success: boolean;
  message: string;
  id: string;
}

const responseObject: RegisterResponse = {
  success: false,
  message: "",
  id: "",
};

export const register = async (req: Request, res: Response) => {
  try {
    let { name, domain, role, email, password } = req.body;

    role = role.toLowerCase();
    domain = domain.toLowerCase();

    // Check if all fields are provided
    if (!(name && role && domain && email && password)) {
      responseObject.message = "All fields are required";
      return res.status(401).json(responseObject);
    }

    // check if user already exists or not
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      responseObject.message = "This Email Is Already Registered";
      return res.status(402).json(responseObject);
    }

    // encrypt password
    const myEnPassword = bcrypt.hashSync(password, 10);

    // create a new entry in db
    const user = (await User.create({
      name,
      role,
      domain,
      email,
      password: myEnPassword,
    })) as Agent | null;

    responseObject.success = true;
    responseObject.message = "User Registered successfully";
    responseObject.id = String(user?._id);

    jwt.sign(
      { userId: user?._id, email },
      process.env.SECRET!,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { secure: true })
          .status(200)
          .json(responseObject);
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof MongooseError) {
      responseObject.message =
        error.name === "CastError" ? "Invalid Ids" : error.message;
      return res.status(401).json(responseObject);
    }
    if (error instanceof Error) {
      responseObject.message = error.message;
      return res.status(500).json(responseObject);
    }
  }
};

interface LoginResponse {
  success: boolean;
  message: string;
  user: Agent | {};
}

const loginResponseObject: LoginResponse = {
  success: false,
  message: "",
  user: {},
};

export const login = async (req: Request, res: Response) => {
  try {
    // collect info
    const { email, password } = req.body;

    console.log(email, password);

    // validate
    if (!(email && password)) {
      responseObject.message = "Email and Password are Required";
      return res.status(401).json(loginResponseObject);
    }

    // check if user exists
    const user = (await User.findOne({ email })) as Agent | null;

    if (!user) {
      loginResponseObject.message = "User Is Not Registered";
      return res.status(401).json(responseObject);
    }

    // Check if password in correct
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      loginResponseObject.message = "Password Is Incorrect";
      return res.status(401).json(responseObject);
    }

    const token = jwt.sign(
      {
        id: user._id,
        email,
        role: user.role,
      },
      process.env.SECRET!,
      {
        expiresIn: "24h",
      }
    );

    loginResponseObject.success = true;
    loginResponseObject.message = "User Logged In";
    loginResponseObject.user = user;

    return res.status(200).json(loginResponseObject);
  } catch (error) {
    console.log(error);
    loginResponseObject.user = {};
    if (error instanceof MongooseError) {
      responseObject.message =
        error.name === "CastError" ? "Invalid Ids" : error.message;
      return res.status(401).json(loginResponseObject);
    }
    if (error instanceof Error) {
      responseObject.message = error.message;
      return res.status(500).json(loginResponseObject);
    }
  }
};
