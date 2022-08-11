const express=require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));
const users = {};
io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        console.log("New user: ", name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined', name);
    })
    socket.on('send', message=>{
        socket.broadcast.emit('recieve', {message: message, name:users[socket.id]})
    })
    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})
const port = 3000 || process.env.port;
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})