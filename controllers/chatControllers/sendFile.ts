import { MongooseError } from "mongoose";
import { fetchRedis } from "../../helpers/fetchRedis";
import { pusherServer } from "../../lib/pusher";
import { Request, Response } from "express";

interface SendFileResponse {
    success: boolean;
    message: string;
  }
  
  const responseObject: SendFileResponse = {
    success: false,
    message: "",
  };

export const sendFile = async (req: Request, res: Response) => {
  try {
    const { filename, issueId, senderId, senderName, timestamp } = req.body;

    if (!(filename && issueId && senderId && senderName && timestamp)) {
        responseObject.message = "All fields are Required";
        return res.status(401).json(responseObject);
      }

    const path = req.file?.path.split("/") as string[] | undefined;

    const message = {
      path,
      filename,
      senderId,
      senderName,
      issueId,
      timestamp: Number(timestamp),
    };

    await fetchRedis(
      "zadd",
      `chat:${issueId}:messages`,
      timestamp,
      JSON.stringify(message)
    );

    pusherServer.trigger(issueId, "incoming-message", message);

    responseObject.success = true;
    responseObject.message = "File Sent Successfully";

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
