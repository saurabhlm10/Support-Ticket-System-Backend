const User = require("../../model/User");
const Issue = require("../../model/Issue")
const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.slice(0, 5);
}

async function createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, chats) {
  let tokenId = generateUniqueId();
  const status = 'raised';

  try {
  // Check if token ID already exists in the database
  while (await Issue.exists({ tokenId })) {
    tokenId = generateUniqueId();
  }
    const issue = new Issue({ tokenId, type, status, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, chats });

    const newIssue = await issue.save();
    return newIssue;
  } catch (err) {
    return err.message;
  }
}

function generateUniqueId() {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.slice(0, 5);
}


exports.noAccess = async (req, res) => {
  try {
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, chats } = req.body

    if (!(studentEmail && studentPhone && raiser && potentialHandlers && handler && info && chats)) {
      return res.status(401).json({
        message: "All fields are required",
        success: false
      })
    }

    const response = await createIssue("noAccess", studentEmail, studentPhone, raiser, potentialHandlers, handler, info, chats)

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue: response
    })

  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message
    })
  }
}

exports.batchChange = async (req, res) => {

}

exports.assignment = async (req, res) => {

}