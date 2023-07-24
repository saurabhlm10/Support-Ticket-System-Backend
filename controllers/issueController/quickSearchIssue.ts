import { Request, Response } from "express";
import Issue from "../../model/Issue";
import { IssueType } from "../../types/Issue";
import { MongooseError } from "mongoose";

interface QuickSearchIssueResponse {
  success: boolean;
  message: string;
  openIssues: IssueType[];
  requestedIssues: IssueType[];
  closedIssues: IssueType[];
}

const responseObject: QuickSearchIssueResponse = {
  success: false,
  message: "",
  openIssues: [],
  requestedIssues: [],
  closedIssues: [],
};

export const quickSearchIssue = async (req: Request, res: Response) => {
  const { searchTerm } = req.params;

  if (!searchTerm) {
    responseObject.message = "searchTerm Is Missing";
    return res.status(401).json(responseObject);
  }

  try {
    const searchResults = (await Issue.find({
      $or: [
        { tokenId: new RegExp(searchTerm, "i") },
        { studentEmail: new RegExp(searchTerm, "i") },
        { studentPhone: new RegExp(searchTerm, "i") },
      ],
    })) as IssueType[];

    const openIssues = searchResults.filter(
      (item) => item.status === "pending"
    );
    const requestedIssues = searchResults.filter(
      (item) => item.status === "not-assigned"
    );
    const closedIssues = searchResults.filter(
      (item) => item.status === "resolved"
    );

    responseObject.success = true;
    responseObject.message = "Fetched Search Results successfully";
    responseObject.openIssues = openIssues;
    responseObject.requestedIssues = requestedIssues;
    responseObject.closedIssues = closedIssues;

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
