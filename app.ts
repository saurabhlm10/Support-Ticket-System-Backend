import dotenv from "dotenv";

dotenv.config();

import express, { Express, Request, Response } from "express";

import cors from "cors"
import morgan from "morgan";
import connectToDb from "./config/db";
import mainRoutes from "./routes/mainRoutes";
import authRoutes from "./routes/authRoutes";
import issueRoutes from "./routes/issueRoutes";
import agentRoutes from "./routes/agentRoutes";
import chatRoutes from "./routes/chatRoutes";


const app = express();

connectToDb();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api", mainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/chat", chatRoutes);

export default app;
