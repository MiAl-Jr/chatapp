const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // socket.id -> name

io.on("connection", (socket) => {

    // JOIN USER
    socket.on("join", (name) => {
        users[socket.id] = name;
        io.emit("user list", Object.values(users));
    });

    // CHAT MESSAGE
    socket.on("chat message", (data) => {
        // data = { msg, id, name }

        io.emit("chat message", {
            msg: data.msg,
            id: data.id,
            name: data.name
        });

        // delivered to others
        socket.broadcast.emit("message delivered", data.id);
    });

    // SEEN
    socket.on("message seen", (id) => {
        io.emit("message seen", id);
    });

    // TYPING
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("stop typing", (name) => {
        socket.broadcast.emit("stop typing", name);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user list", Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
