import { Request, Response } from "express";

import { db } from "../../lib/db";
import { MongooseError } from "mongoose";

interface GetChatResponse {
  success: boolean;
  message: string;
  messages: string[];
}

const responseObject: GetChatResponse = {
  success: false,
  message: "",
  messages: [],
};

exports.getChatsByIssueId = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.params;

    if (!issueId) {
      responseObject.message = "Issue Id Is Missing";
      res.status(401).json(responseObject);
    }

    const messages = (await db.zrange(
      `chat:${issueId}:messages`,
      0,
      -1
    )) as string[];

    responseObject.success = true;
    responseObject.message = "Messages Fetched Successfully";
    responseObject.messages = messages;

    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    if (error instanceof MongooseError) {
      responseObject.message =
        error.name === "CastError" ? "Invalid issueId" : error.message;
      return res.status(401).json(responseObject);
    }
    if (error instanceof Error) {
      responseObject.message = error.message;
      return res.status(500).json(responseObject);
    }
  }
};
