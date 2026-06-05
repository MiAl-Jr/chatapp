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

    // typing event
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("stop typing", () => {
        socket.broadcast.emit("stop typing");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
