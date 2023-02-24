const mongoose = require("mongoose");
const Msg = require('./models/messages');
const express = require("express");
let fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoDB = 'mongodb+srv://ajoymahato16:PJ6yH8PzKMR3igsI@cluster0.wmldu9m.mongodb.net/chat?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(()=>{

}).catch(err =>console.log(err));


var users = {};
app.use(express.static(path.join(__dirname+"/public")));
io.on("connection", function(socket){    
    socket.on("newuser",function(username){
        users[socket.id] = username;        
        socket.broadcast.emit("user-connected",username);
    });
    socket.on("exituser",function(){       
        socket.broadcast.emit("user-left", user = users[socket.id]);   
        delete users[socket.id];
    });
    socket.on("chat",function(message){        
        const chatmessage = new Msg({msg:message});
        chatmessage.save().then(()=>{
            socket.broadcast.emit("chat",message);
        })
        
    });
    
  
});
app.get("/api/:user",(request,response)=> {
    let user = request.params.user
    Msg.find({"username":`${user}`})
    .then(result=>{
        response.status(200).json({
            chatMessage:result            
        })
    })
  
    
})

server.listen(5000);