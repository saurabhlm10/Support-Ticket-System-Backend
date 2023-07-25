import { Request, Response } from "express";

import Issue from "../../model/Issue";
import { MongooseError } from "mongoose";

interface GetAgentClosedChatsResponse {
  success: boolean;
  message: string;
  issues: IssueType[];
}

const responseObject: GetAgentClosedChatsResponse = {
  success: false,
  message: "",
  issues: [],
};

export const getAgentClosedChats = async (req: Request, res: Response) => {
  const { agentEmail } = req.params;

  if (!agentEmail) {
    responseObject.message = "agentEmail Is Missing";
    return res.status(401).json(responseObject);
  }

  try {
    const closedIssues = (await Issue.find({
      raiser: agentEmail,
      status: "resolved",
    })
      .populate("handler")
      .exec()
      .then((updatedClosedIssues) => {
        updatedClosedIssues.forEach((item) => {
          item.handler.password = null;
        });

        return updatedClosedIssues;
      })
      .catch((e: Error) => {
        console.log(e);
        return [];
      })) as IssueType[] | null;

    responseObject.success = true;
    responseObject.message = "Agent Closed Chats fetched successfully";
    responseObject.issues = closedIssues as IssueType[];

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
