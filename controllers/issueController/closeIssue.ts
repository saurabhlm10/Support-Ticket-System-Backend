import { Request, Response } from "express";

import Issue from "../../model/Issue";
import { IssueType } from "../../types/Issue";
import { MongooseError } from "mongoose";

interface CloseIssueResponse {
  success: boolean;
  message: string;
  issue: IssueType | {};
}

const responseObject: CloseIssueResponse = {
  success: false,
  message: "",
  issue: {},
};

export const closeIssue = async (req: Request, res: Response) => {
  const { issueId } = req.params;

  if (!issueId) {
    responseObject.message = "issueId Is Missing";
    return res.status(401).json(responseObject);
  }

  try {
    const response = (await Issue.findByIdAndUpdate(
      issueId,
      { status: "resolved" },
      {
        new: true,
      }
    )) as IssueType | null;

    if (!response) {
      responseObject.message = "Issue Could Not Be Updated";
      return res.status(402).json(responseObject);
    }

    responseObject.success = true;
    responseObject.message = "Issue Resolved successfully";
    responseObject.issue = response as IssueType;

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
