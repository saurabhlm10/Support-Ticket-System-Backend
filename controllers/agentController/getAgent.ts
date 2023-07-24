import { Request, Response } from "express";
import User from "../../model/User";
import { Agent, AgentWithoutPassword } from "../../types/Agent";
import { MongooseError } from "mongoose";

interface GetAgentResponse {
  success: boolean;
  message: string;
  agent: AgentWithoutPassword | {};
}

const responseObject: GetAgentResponse = {
  success: false,
  message: "",
  agent: {},
};

export const getAgent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      responseObject.message = "User Id Is Missing";
      return res.status(401).json(responseObject);
    }

    const agent = (await User.findById(userId)) as AgentWithoutPassword | null;

    if (!agent) {
      responseObject.message = "Agent Not Found";
      return res.status(401).json(responseObject);
    }

    responseObject.success = true;
    responseObject.message = "Agent Fetched Successfully";
    responseObject.agent = agent as AgentWithoutPassword;

    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    responseObject.agent = {};
    if (error instanceof MongooseError) {
      responseObject.message =
        error.name === "CastError" ? "Invalid UserId" : error.message;
      return res.status(401).json(responseObject);
    }
    if (error instanceof Error) {
      responseObject.message = error.message;
      return res.status(500).json(responseObject);
    }
  }
};
