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

/**
+ * Retrieves a list of agents based on their role.
+ *
+ * @param {Request} req - The request object.
+ * @param {Response} res - The response object.
+ * @return {Promise<void>} The function does not return anything.
+ */
export const getAgentByRole = async (req: Request, res: Response) => {
  const { agentRole } = req.params;

  if (!agentRole) {
    responseObject.message = "Agent Role Is Missing";
    return res.status(401).json(responseObject);
  }

  const agentRoles = ["assignment", "chat", "email", "admin", "discord"];

  if (!agentRoles.includes(agentRole)) {
    responseObject.message = "Agent Role Is Invalid";
    return res.status(401).json(responseObject);
  }

  try {
    // const tempAgentList = await User.find({ role: agentRole }) as AgentWithoutPassword[]
    const agentList = (await User.find({
      role: agentRole,
    })) as AgentWithoutPassword[];

    console.log(agentList);
    responseObject.success = true;
    responseObject.message = "Agent List Fetched Successfully";
    responseObject.agents = agentList;

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
