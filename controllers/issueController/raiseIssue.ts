import { Request, Response } from "express";

import User from "../../model/User";
import Issue from "../../model/Issue";
import { v4 as uuidv4 } from "uuid";
import Chat from "../../model/Chat";
// import { IssueType } from "../../types/Issue";
import { MongooseError } from "mongoose";
import { IssueType } from "../../types/Issue";

function generateUniqueId() {
  const uuid: string = uuidv4().replace(/-/g, "");
  return uuid.slice(0, 5);
}

async function createIssue(
  type: string,
  studentEmail: string,
  studentPhone: string,
  raiser: string,
  potentialHandlers: string[],
  handler: string,
  info: object,
  description: string,
  attachments: any
) {
  let tokenId = generateUniqueId();
  const status = handler ? "pending" : "not-assigned";

  console.log("3");

  try {
    // Check if token ID already exists in the database
    while (await Issue.exists({ tokenId })) {
      tokenId = generateUniqueId();
    }
    const newIssue = (await Issue.create({
      tokenId,
      type,
      status,
      studentEmail,
      studentPhone,
      raiser,
      potentialHandlers,
      handler,
      info,
      description,
      attachments,
    })) as IssueType | null;

    console.log(newIssue);

    if (status === "pending") {
      const participants = [raiser, handler];

      await Chat.create({
        issueId: tokenId,
        participants,
      });
    }

    console.log("4");

    return newIssue;
  } catch (error) {
    console.log('ERROR')
    console.log(error);
    if (error instanceof MongooseError) {
      let message = error.name === "CastError" ? "Invalid Ids" : error.message;
      return message;
    }
    if (error instanceof Error) {
      let message = error.message;
      return message;
    }
  }
}

interface RaiseIssueResponse {
  success: boolean;
  message: string;
  issue: IssueType | {};
}

const responseObject: RaiseIssueResponse = {
  success: false,
  message: "",
  issue: {},
};

export const raiseIssue = async (req: Request, res: Response) => {
  const { type } = req.params;

  if (!type) {
    responseObject.message = "type Is Missing";
    return res.status(401).json(responseObject);
  }

  const issueTypes = ["no-access", "batch-change", "assignment", "other"];

  if (!issueTypes.includes(type)) {
    return res.status(402).json({
      success: false,
      message: "Please select a type of issue",
    });
  }

  const {
    studentEmail,
    studentPhone,
    raiser,
    potentialHandlers,
    handler,
    info,
    description,
  } = JSON.parse(req.body?.options || {});

  console.log("BODY", JSON.parse(req.body.options));

  let attachments = new Array();

  console.log("121");

  if (
    (type === "no-access" || type === "batch-change") &&
    !info.paymentReceipt
  ) {
    console.log("first");
    // debug it
    if (
      (req.files as { [fieldname: string]: Express.Multer.File[] })
        .paymentReceiptImage
    ) {
      info.paymentReceipt = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      ).paymentReceiptImage[0].path;
    }
  }
  console.log("137");

  // if (req.files?.length > 0) {
  //   if (
  //     req.files["attachmentInput[]"] &&
  //     req.files["attachmentInput[]"].length > 0
  //   ) {
  //     req.files["attachmentInput[]"].forEach((attachment: any) => {
  //       attachments.push(attachment.path);
  //     });
  //   }
  // }

  console.log("req.files", req.files);
  console.log("req.files", req.files);

  if (
    (req.files as { length?: number })?.length &&
    (req.files as { [key: string]: any })["attachmentInput[]"] &&
    (req.files as { [key: string]: any })["attachmentInput[]"].length > 0
  ) {
    console.log("entered");
    (req.files as { [key: string]: any })["attachmentInput[]"].forEach(
      (attachment: any) => {
        attachments.push(attachment.path);
      }
    );
  }

  console.log("0");

  if (potentialHandlers?.length < 1 && !handler) {
    responseObject.message = "At least one potential handler is required";
    return res.status(401).json(responseObject);
  }

  if (!(studentEmail && studentPhone && raiser && info)) {
    responseObject.message = "All fields are required";
    return res.status(401).json(responseObject);
  }

  console.log("1");

  const response = await createIssue(
    type,
    studentEmail,
    studentPhone,
    raiser,
    potentialHandlers,
    handler,
    info,
    description,
    attachments
  );

  console.log("2");

  responseObject.success = true;
  responseObject.message = "Issue Raised successfully";
  responseObject.issue = response as IssueType;

  return res.status(200).json(responseObject);
};
