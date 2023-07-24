import { Document, Types } from "mongoose";

interface IssueType extends Document {
  tokenId: string;
  type: "assignment" | "batch-change" | "no-access" | "other";
  status: "not-assigned" | "pending" | "resolved";
  studentEmail: string;
  studentPhone: string;
  raiser: Types.ObjectId;
  potentialHandlers?: Types.ObjectId[];
  handler: Types.ObjectId | "";
  info?: any; // Change 'any' to a more specific type if possible
  chats?: string[];
  description?: string;
  attachments?: string[];
}
