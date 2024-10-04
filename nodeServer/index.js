// Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};
const fieldExpert = {};
let expert = "hello";

io.on("connection", (socket) =>{
    console.log("Socket id - ",socket.id);
    socket.on("field-expert-joined", (ename) => {
        console.log("Field Expert - ", ename);
        // if(Object.keys(fieldExpert).length > 0){
        //     socket.disconnect();
        //     return;
        // }
        expert = socket.id;
        fieldExpert[socket.id] = ename;
        socket.broadcast.emit("expert-joined", ename);
    });
    socket.on("new-user-joined", (ename) => {
        console.log("New user - ", ename);
        users[socket.id] = ename;
        socket.broadcast.emit("user-joined", {uName: ename, userId: socket.id});
    });
    
    socket.on("expert-send", (data) =>{
        io.to(data.receiver).emit("receive", {message: data.message, ename: "Expert"});
    });
    
    // socket.on("hello", (message) =>{
    //     socket.emit("hi", {message: message, ename: "Server"});
    // });
    
    socket.on("send", (message) =>{
        // socket.broadcast.emit("receive", {message: message, ename: users[socket.id]});
        io.to(expert).emit("receive", {message: message, userId: socket.id, ename: `${users[socket.id]}`});
    });
    
    socket.on("disconnect", (message) =>{
        socket.broadcast.emit("left", socket.id);
        delete users[socket.id];
    });
});