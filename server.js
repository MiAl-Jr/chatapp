const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
const fixedUser = "Admin"; // special tracked name

io.on("connection", (socket) => {

    // USER JOIN
    socket.on("join", (name) => {

        users[socket.id] = name;

        // update online users
        io.emit("user list", Object.values(users));

        // 🚨 notify everyone if fixed user joins
        if (name === fixedUser) {
            io.emit("special user joined", name);
        }
    });

    // CHAT MESSAGE
    socket.on("chat message", (data) => {

        io.emit("chat message", {
            msg: data.msg,
            id: data.id,
            name: data.name
        });

        socket.broadcast.emit("message delivered", data.id);
    });

    // MESSAGE SEEN
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
