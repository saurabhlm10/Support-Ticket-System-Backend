import { Request, Response } from "express";

import { fetchRedis } from "../../helpers/fetchRedis";
import { db } from "../../lib/db";
import { pusherServer } from "../../lib/pusher";
import { MongooseError } from "mongoose";

interface SendMessageResponse {
  success: boolean;
  message: string;
}

const responseObject: SendMessageResponse = {
  success: false,
  message: "",
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { issueId, text, senderEmail, senderName, timestamp } = req.body;

    if (!issueId) {
      responseObject.message = "Issue Id Is Missing";
      return res.status(401).json(responseObject);
    }

    if (!text) {
      responseObject.message = "Text Cannot Be Empty";
      return res.status(401).json(responseObject);
    }

    if (!(senderEmail && senderName && timestamp)) {
      responseObject.message = "All fields are Required";
      return res.status(401).json(responseObject);
    }

    const message = {
      text,
      senderEmail,
      senderName,
      issueId,
      timestamp,
    };

    await fetchRedis(
      "zadd",
      `chat:${issueId}:messages`,
      timestamp,
      JSON.stringify(message)
    );

    pusherServer.trigger(issueId, "incoming-message", {
      text,
      senderEmail,
      senderName,
      issueId,
      timestamp,
    });

    responseObject.success = true;
    responseObject.message = "Message Sent Successfully";

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
