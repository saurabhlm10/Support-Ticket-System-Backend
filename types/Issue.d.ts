interface IssueType {
  tokenId: string;
  type: "assignment" | "batch-change" | "no-access" | "other";
  status: "not-assigned" | "pending" | "resolved";
  studentEmail: string;
  studentPhone: string;
  raiser: string;
  potentialHandlers?: string[];
  handler: string;
  info?: any; // Change 'any' to a more specific type if possible
  chats?: string[];
  description?: string;
  attachments?: string[];
}
