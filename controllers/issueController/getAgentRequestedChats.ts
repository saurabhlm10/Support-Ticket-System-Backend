import { Request, Response } from "express";
import Issue from "../../model/Issue";
import { IssueType } from "../../types/Issue";
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

exports.getAgentRequestedChats = async (req: Request, res: Response) => {
  const { agentId } = req.params;

  if (!agentId) {
    responseObject.message = "agentId Is Missing";
    return res.status(401).json(responseObject);
  }

  try {
    const requestedIssues = (await Issue.find({
      raiser: agentId,
      status: "not-assigned",
    })
      .populate("potentialHandlers")
      .exec()
      .then((updatedResponse) => {
        // updatedResponse.forEach((itemArray) => {
        //     itemArray.potentialHandlers.forEach((item) => {
        //         item.password = null
        //     })
        // })
        return updatedResponse;
      })
      .catch((e) => {
        console.log(e);
        return [];
      })) as IssueType[];

    responseObject.success = true;
    responseObject.message = "Agent Open Chats fetched successfully";
    responseObject.issues = requestedIssues;

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
