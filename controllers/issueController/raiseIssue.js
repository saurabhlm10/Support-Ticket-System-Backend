const User = require("../../model/User");
const Issue = require("../../model/Issue")
const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.slice(0, 5);
}

async function createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description) {
  let tokenId = generateUniqueId();
  const status = 'raised';

  try {
  // Check if token ID already exists in the database
  while (await Issue.exists({ tokenId })) {
    tokenId = generateUniqueId();
  }
    const newIssue = await Issue.create({ tokenId, type, status, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description });
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
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description } = req.body

    if(potentialHandlers.length < 1 && !handler ){
      return res.status(401).json({
        message: "There should be at least one potential handler or handler",
        success: false
      })
    }

    if (!(studentEmail && studentPhone && raiser && potentialHandlers && info)) {
      return res.status(401).json({
        message: "All fields are required",
        success: false
      })
    }

    const response = await createIssue("noAccess", studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description)

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
  try {
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description } = req.body

    if (!(studentEmail && studentPhone && raiser && potentialHandlers && handler && info)) {
      return res.status(401).json({
        message: "All fields are required",
        success: false
      })
    }

    const response = await createIssue("batchChange", studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description)

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

exports.assignment = async (req, res) => {
  try {
    const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description } = req.body

    if (!(studentEmail && studentPhone && raiser && potentialHandlers && handler && info)) {
      return res.status(401).json({
        message: "All fields are required",
        success: false
      })
    }

    const response = await createIssue("assignment", studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description)

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