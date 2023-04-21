const User = require("../../model/User");
const Issue = require("../../model/Issue")
const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.slice(0, 5);
}

async function createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments) {
  let tokenId = generateUniqueId();
  const status = handler ? "pending" : 'not-assigned';

  try {
    // Check if token ID already exists in the database
    while (await Issue.exists({ tokenId })) {
      tokenId = generateUniqueId();
    }
    const newIssue = await Issue.create({ tokenId, type, status, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments });

    return newIssue;
  } catch (error) {
    return error.message
  }
}

exports.raiseIssue = async (req, res) => {
  const { type } = req.params

  // console.log(req.paymentReceiptImage)
  // console.log(req.file)
  // return res.status(200).json({
  //   files: req.files
  //   // paymentReceiptImage: req.paymentReceiptImage
  // })

  const issueTypes = ["no-access", "batch-change", "assignment", "other"]

  if (!issueTypes.includes(type)) {
    return res.status(402).json({
      success: false,
      message: "Please select a type of issue"
    })
  }

  const { studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description } = JSON.parse(req.body.options)

  let attachments = new Array()

  if ((type === 'no-access' || type === 'batch-change') && !info.paymentReceipt) {
    if(req.files.paymentReceiptImage){
      info.paymentReceipt = req.files.paymentReceiptImage[0].path
    }
  }

  if (req.files['attachmentInput[]'] && req.files['attachmentInput[]'].length > 0) {
    req.files['attachmentInput[]'].forEach(attachment => {
      attachments.push(attachment.path)
    });
  }

  if (potentialHandlers?.length < 1 && !handler) {
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

  const response = await createIssue(type, studentEmail, studentPhone, raiser, potentialHandlers, handler, info, description, attachments)

  return res.status(201).json({
    success: true,
    message: "Issue created successfully",
    issue: response
  })
}