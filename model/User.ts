import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      enum: ["java", "javascript", "data-science", "all"],
      required: true,
    },
    role: {
      type: String,
      enum: ["assignment", "chat-support", "email", "admin", "discord"],
      required: true,
    },
    issuesRaised: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
