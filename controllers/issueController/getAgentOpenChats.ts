import { Request, Response } from "express";

import Issue from "../../model/Issue";
import { MongooseError } from "mongoose";

interface GetAgentOpenChatsResponse {
  success: boolean;
  message: string;
  issues: IssueType[];
}

const responseObject: GetAgentOpenChatsResponse = {
  success: false,
  message: "",
  issues: [],
};

export const getAgentOpenChats = async (req: Request, res: Response) => {
  const { agentEmail } = req.params;

  if (!agentEmail) {
    responseObject.message = "agentEmail Is Missing";
    return res.status(401).json(responseObject);
  }

  try {
    const openIssues = (await Issue.find({
      $or: [{ raiser: agentEmail }, { handler: agentEmail }],
      status: "pending",
    })
      .populate("handler")
      .exec()
      .then((updatedResponse) => {
        if (updatedResponse) {
          updatedResponse.forEach((item) => {
            item.handler.password = null;
          });
          return updatedResponse;
        }
      })
      .catch((e) => {
        console.log(e);
        return [];
      })) as IssueType[];

    responseObject.success = true;
    responseObject.message = "Agent Open Chats fetched successfully";
    responseObject.issues = openIssues as IssueType[];

    res.status(200).json(responseObject);
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
