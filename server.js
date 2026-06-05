const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // socket.id -> name

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // when user joins
    socket.on("join", (name) => {
        users[socket.id] = name;

        io.emit("user list", Object.values(users)); // update all users
    });

    // chat message
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // typing
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("stop typing", (name) => {
        socket.broadcast.emit("stop typing", name);
    });

    // disconnect = offline
    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user list", Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
