import { Document, Types } from "mongoose";

interface ChatType extends Document {
  issueId: string;
  participants: Types.ObjectId[];
}
