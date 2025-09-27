import server from "./app";
import { Server } from "socket.io";

const port = process.env.PORT || 8000;

const io = new Server(server, {
  cors: { origin: "*" },
});

const ROOM = "group";
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("joinRoom", async (userName) => {
    console.log(`${userName} is joinig the roomm......`);

    await socket.join(ROOM);

    // send the message to al the user is join the  room
    // io.to(ROOM).emit("roomNotice", userName);

    // broad cast to all except the own

    socket.to(ROOM).emit("roomNotice", userName);
  });

  socket.on("chatMessage", (msg) => {
    console.log("msg", msg);
    socket.to(ROOM).emit("chatMessage", msg);
  });
});

server.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
