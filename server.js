const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("ruk ja likh rha hu!!", () => {
           socket.broadcast.emit("ruk ja likh rha hu!!");
    });

    console.log("User connected");
    socket.on("typing", () => {

        socket.broadcast.emit("typing");

    });

    socket.on("chat message", (msg) => {

        io.emit("chat message", msg);

    });

});

http.listen(3000, () => {
    console.log("Server running");
});
