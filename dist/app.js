"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const mainRoutes_1 = __importDefault(require("./routes/mainRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", mainRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/issue", issueRoutes_1.default);
app.use("/api/agent", agentRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
exports.default = app;
