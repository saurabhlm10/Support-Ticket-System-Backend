const express = require("express");
const router = express.Router();
// const multer = require("multer");

// const auth = require('../middleware/auth')

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const { home } = require("../controllers/home");

router.get("/", home);



module.exports = router;
