const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const {generateMessages, generateLocationMessage} = require('./utils/messages');

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join('__dirname',"../public");
app.use(express.static(publicDirectoryPath));


io.on('connection',(socket) => {
    console.log("New web socket connection")
    socket.emit('message', generateMessages("Welcome"))
    socket.broadcast.emit('message',generateMessages("A new user has joined!"))

    socket.on('send-message',(message,callback)=>{
        io.emit('message',generateMessages(message))
        callback("delieved!")
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessages('A user has left!'))
    })
    socket.on('shareLocation',(data,callback)=>{
        io.emit('location-message',generateLocationMessage(`https://google.com/maps/?q=${data.latitude},${data.longitude}`))
        callback()
    })
})

server.listen(port,()=>{
    console.log("I am running at port ",port)
}) 