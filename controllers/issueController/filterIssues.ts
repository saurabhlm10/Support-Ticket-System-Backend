import { Request, Response } from "express";

import Issue from "../../model/Issue";
import { MongooseError } from "mongoose";
import { IssueType } from "../../types/Issue";

interface FilterIssuesResponse {
  success: boolean;
  message: string;
  issues: IssueType[];
}

const responseObject: FilterIssuesResponse = {
  success: false,
  message: "",
  issues: [],
};

export const filterIssues = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data) {
      responseObject.message = "Data Is Missing";
      return res.status(401).json(responseObject);
    }

    const arr = [];
    for (let [key, value] of Object.entries(data)) {
      if (value !== "") {
        arr.push([key, (value as string).toLowerCase()]);
      }
    }
    const filterObj = Object.fromEntries(arr);
    console.log(filterObj);

    const filteredData = (await Issue.find(filterObj)) as IssueType[];

    if (!filteredData) {
      responseObject.message = "Issues Could Not Be Fetched";
      return res.status(402).json(responseObject);
    }

    responseObject.success = true;
    responseObject.message = "Issues Fetched Successfully";
    responseObject.issues = filteredData;

    res.status(200).json(responseObject);
  } catch (error) {
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
