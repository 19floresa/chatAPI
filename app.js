const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const routes = require('./routes/routes');
app.use('', routes);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

io.on('connection', (socket) => {
  socket.on('login', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} connected and joined room: ${userId}`);
  });

  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    io.to(message.receiverId).emit('messageReceived', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Export 'app' and 'server' if needed elsewhere in your project (e.g., for testing)
module.exports = { app, server, io };
