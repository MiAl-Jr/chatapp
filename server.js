const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // chat message
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // typing event (send user name + id)
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });

    socket.on("stop typing", (data) => {
        socket.broadcast.emit("stop typing", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
