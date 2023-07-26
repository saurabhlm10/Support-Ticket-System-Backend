import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 5,
    },
    type: {
      type: String,
      enum: ["assignment", "batch-change", "no-access", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["not-assigned", "pending", "resolved"],
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentPhone: {
      type: String,
      required: true,
    },
    raiser: {
      type: String,
      required: true,
    },
    potentialHandlers: {
      type: [String],
    },
    handler: {
      type: String,
      default: "",
    },
    info: {
      type: mongoose.Schema.Types.Mixed,
    },
    chats: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
