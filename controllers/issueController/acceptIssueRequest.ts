import { Request, Response } from "express";
import Issue from "../../model/Issue";
import { MongooseError } from "mongoose";
import { IssueType } from "../../types/Issue";

interface AcceptIssueRequestResponse {
  success: boolean;
  message: string;
  issue: IssueType | {};
}

const responseObject: AcceptIssueRequestResponse = {
  success: false,
  message: "",
  issue: {},
};

export const acceptIssueRequest = async (req: Request, res: Response) => {
  try {
    const { issueId, agentEmail } = req.params;

    if (!(issueId && agentEmail)) {
      responseObject.message = "issueId or agentEmail Is Missing";
      return res.status(401).json(responseObject);
    }

    const response = (await Issue.findByIdAndUpdate(
      issueId,
      {
        handler: agentEmail,
        potentialHandlers: [],
        status: "pending",
      },
      {
        new: true,
      }
    )) as IssueType | null;

    if (!response) {
      responseObject.message = "Issue Could Not Be Updated";
      return res.status(402).json(responseObject);
    }

    responseObject.success = true;
    responseObject.message = "Issue Request Accepted successfully";
    responseObject.issue = response as IssueType;

    return res.status(200).json(responseObject);
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
