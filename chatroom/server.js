const mongoose = require("mongoose");
const Msg = require('./models/messages');
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoDB = 'mongodb+srv://ajoymahato16:PJ6yH8PzKMR3igsI@cluster0.wmldu9m.mongodb.net/chat?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(()=>{
    console.log("Test song.");
}).catch(err =>console.log(err));

app.use(express.static(path.join(__dirname+"/public")));
io.on("connection", function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update",username+ " has joined the conversation");
    })
    socket.on("exituser",function(username){
        socket.broadcast.emit("update",username+ " has left the conversation");
    })
    socket.on("chat",function(message){
        const chatmessage = new Msg({msg:message});
        chatmessage.save().then(()=>{
            socket.broadcast.emit("chat",message);
        })
        
    })
})
server.listen(5000);