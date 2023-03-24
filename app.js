const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")
const connectToDb = require('./config/db')
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors : {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
    }
});

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

const users = {}; // Object to store user data

// Define socket.io event handlers
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('register', (username) => {
        console.log(`${socket.id} registered as ${username}`);
        users[socket.id] = {
          username,
          socket,
        };
      });
  
      // Handle chat message
      socket.on('message', (message) => {
        console.log(`Message received from ${users[socket.id].username}: ${message.text}`);
        console.log(message)
        io.emit('message', {
          username: users[socket.id].username,
          message,
        });
      });
    
    // Remove user when disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        delete users[socket.id];
      });    
  });

module.exports = server