import { Request, Response } from "express";
import Chat from "../../model/Chat";
import { ChatType } from "../../types/Chat";
import { MongooseError } from "mongoose";

interface GetChatResponse {
  success: boolean;
  message: string;
  chat: ChatType | {};
}

const responseObject: GetChatResponse = {
  success: false,
  message: "",
  chat: {},
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.params;

    if (!issueId) {
      responseObject.message = "Issue Id Is Missing";
      res.status(401).json(responseObject);
    }

    const chat = (await Chat.findOne({ issueId })) as ChatType;

    if (!chat) {
      responseObject.message = "Chat Not Found";
      return res.status(402).json(responseObject);
    }

    responseObject.success = true;
    responseObject.message = "Chat Fetched Successfully";
    responseObject.chat = chat;

    return res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    responseObject.chat = {};
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
