"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const home_1 = require("../controllers/home");
router.get("/", home_1.home);
exports.default = router;
