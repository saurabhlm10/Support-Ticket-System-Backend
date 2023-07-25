"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../model/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const responseObject = {
    success: false,
    message: "",
    id: "",
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userAlreadyExists = yield User_1.default.findOne({ email });
        if (userAlreadyExists) {
            responseObject.message = "This Email Is Already Registered";
            return res.status(402).json(responseObject);
        }
        // encrypt password
        const myEnPassword = bcryptjs_1.default.hashSync(password, 10);
        // create a new entry in db
        const user = (yield User_1.default.create({
            name,
            role,
            domain,
            email,
            password: myEnPassword,
        }));
        responseObject.success = true;
        responseObject.message = "User Registered successfully";
        responseObject.id = user === null || user === void 0 ? void 0 : user._id;
        jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id, email }, process.env.SECRET, { expiresIn: "24h" }, (err, token) => {
            if (err)
                throw err;
            res
                .cookie("token", token, { secure: true })
                .status(200)
                .json(responseObject);
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid Ids" : error.message;
            return res.status(401).json(responseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(responseObject);
        }
    }
});
exports.register = register;
const loginResponseObject = {
    success: false,
    message: "",
    user: {},
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = (yield User_1.default.findOne({ email }));
        if (!user) {
            loginResponseObject.message = "User Is Not Registered";
            return res.status(401).json(responseObject);
        }
        // Check if password in correct
        const checkPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!checkPassword) {
            loginResponseObject.message = "Password Is Incorrect";
            return res.status(401).json(responseObject);
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email,
            role: user.role,
        }, process.env.SECRET, {
            expiresIn: "24h",
        });
        loginResponseObject.success = true;
        loginResponseObject.message = "User Logged In";
        loginResponseObject.user = user;
        return res.status(200).json(loginResponseObject);
    }
    catch (error) {
        console.log(error);
        loginResponseObject.user = {};
        if (error instanceof mongoose_1.MongooseError) {
            responseObject.message =
                error.name === "CastError" ? "Invalid Ids" : error.message;
            return res.status(401).json(loginResponseObject);
        }
        if (error instanceof Error) {
            responseObject.message = error.message;
            return res.status(500).json(loginResponseObject);
        }
    }
});
exports.login = login;
