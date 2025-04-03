require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const parser = require("socket.io-msgpack-parser");

const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT || 8080;

console.log("Client URL:", CLIENT_URL);
console.log("Port:", PORT);

app.use(
  cors({
    origin: [CLIENT_URL],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  parser,
  cors: {
    origin: [CLIENT_URL],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (room) => {
    console.log(`${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("leave", (room) => {
    console.log(`${socket.id} left room: ${room}`);
    socket.leave(room);
  });

  socket.on("getElements", ({ elements, room }) => {
    console.log(`Received elements from ${socket.id} for room ${room}`);
    socket.to(room).emit("setElements", elements);
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
