const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const mongoose = require("mongoose");

app.use(express.static("public"));

mongoose.connect("mongodb+srv://MiAl-Jr:9205441522@mial-jr.op7nak8.mongodb.net/?appName=MiAl-Jr");

const MessageSchema = new mongoose.Schema({
    text:String
});

const Message = mongoose.model("Message", MessageSchema);

let onlineUsers = 0;

io.on("connection", async (socket) => {

    console.log("User connected");

    onlineUsers++;

    io.emit("online users", onlineUsers);

    const oldMessages = await Message.find();

    socket.emit("load messages", oldMessages);

    socket.on("chat message", async (msg) => {

        const message = new Message({
            text:msg
        });

        await message.save();

        io.emit("chat message", msg);

    });

    socket.on("disconnect", () => {

        onlineUsers--;

        io.emit("online users", onlineUsers);

        console.log("User disconnected");

    });

});

http.listen(3000, () => {
    console.log("Server running");
});
