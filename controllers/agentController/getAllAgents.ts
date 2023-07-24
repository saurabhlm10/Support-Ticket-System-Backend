import { Request, Response } from "express";
import User from "../../model/User";
import { AgentWithoutPassword } from "../../types/Agent";
import { MongooseError } from "mongoose";

interface GetAgentByRoleResponse {
  success: boolean;
  message: string;
  agents: AgentWithoutPassword[];
}

const responseObject: GetAgentByRoleResponse = {
  success: false,
  message: "",
  agents: [],
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const allAgentsList = (await User.find()) as AgentWithoutPassword[];

    responseObject.success = true;
    responseObject.message = "Agent List Fetched Successfully";
    responseObject.agents = allAgentsList;

    return res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    responseObject.agents = [];
    if (error instanceof MongooseError) {
      responseObject.message =
        error.name === "CastError" ? "Invalid agentRole" : error.message;
      return res.status(401).json(responseObject);
    }
    if (error instanceof Error) {
      responseObject.message = error.message;
      return res.status(500).json(responseObject);
    }
  }
};
