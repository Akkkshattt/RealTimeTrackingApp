const express = require("express");
const app = express();

//boiler plate for socket io
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
//ends here

io.on("connection",function(socket){
    //front end se send-location naam ka socket bheja tha we are gonna use/accept it here now
    socket.on("send-location",function(data){
     // now ussi data ko use krke wapas front end pr bhej denge and to all the other connections connected to io
     io.emit("receive-location",{id:socket.id,...data});
    });
    console.log("Connected");
    //when the user has disconnected so handling event for that and sending it to front end 
    socket.on("user-disconnected",function(){
        io.emit("user-disconnected",socket.id)
    })
});

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
    res.render("index")
})

server.listen(3000);