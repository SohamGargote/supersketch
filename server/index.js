require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const parser = require("socket.io-msgpack-parser");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5180";
const PORT = process.env.PORT || 8080;

console.log("Client URL:", CLIENT_URL);
console.log("Port:", PORT);

// Enable CORS for all routes
app.use(cors({
  origin: true,
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  parser,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store elements for each room
const roomElements = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (room) => {
    console.log(`${socket.id} joined room: ${room}`);
    socket.join(room);
    
    // If there are elements in this room, send them to the new user
    if (roomElements[room]) {
      console.log(`Sending existing elements to ${socket.id} for room ${room}`);
      socket.emit("setElements", roomElements[room]);
    } else {
      // Initialize empty elements array for this room
      roomElements[room] = [];
    }
    
    // Request elements from other users in the room
    socket.to(room).emit("requestElements", room);
  });

  socket.on("leave", (room) => {
    console.log(`${socket.id} left room: ${room}`);
    socket.leave(room);
  });

  socket.on("getElements", ({ elements, room }) => {
    console.log(`Received elements from ${socket.id} for room ${room}`);
    // Store elements for this room
    roomElements[room] = elements;
    // Broadcast to other users in the room
    socket.to(room).emit("setElements", elements);
  });

  socket.on("requestElements", (room) => {
    console.log(`Received request for elements from ${socket.id} for room ${room}`);
    // If we have elements for this room, send them
    if (roomElements[room]) {
      console.log(`Sending elements to ${socket.id} for room ${room}`);
      socket.emit("setElements", roomElements[room]);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send(
    `<marquee>To try the app visit: <a href="${CLIENT_URL}">${CLIENT_URL}</a></marquee>`
  );
});

server.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
