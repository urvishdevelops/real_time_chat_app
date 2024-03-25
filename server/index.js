import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

// server initialized and converting http into socket
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.Node_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id.substring(0,5)} connected`);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)} : ${data}`);
  });


});

// listening http server
httpServer.listen(3500, () => {
  console.log("listening on the port 3500");
});
