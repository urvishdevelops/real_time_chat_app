import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// listening http server
const expressServer = app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});

// server initialized and converting http into socket
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.Node_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id.substring(0, 5)} connected`);

  // Upon connection - only to user
  socket.emit("message", "welcome to our message app");

  // upon connection - to all others
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 5)} connected`
  );

  // listening for an message event
  socket.on("message", (data) => {
    io.emit("message", `${socket.id.substring(0, 5)} : ${data}`);
  });

  // when user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} disconnected`
    );
  });

  // listen to an activity
  socket.on('activity', (name)=>{
    socket.broadcast.emit('activity', name)
  })
});
