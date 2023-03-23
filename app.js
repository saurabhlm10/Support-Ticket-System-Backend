const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")
const connectToDb = require('./config/db')

const app = express()

connectToDb()

app.use(cors());
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mainRoutes = require("./routes/mainRoutes")
const authRoutes = require("./routes/authRoutes")
const issueRoutes = require("./routes/issueRoutes")

app.use('/api', mainRoutes)
app.use('/api/auth', authRoutes)
app.use("/api/issue", issueRoutes)

module.exports = app