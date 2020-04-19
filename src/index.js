const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const {generateMessages, generateLocationMessage} = require('./utils/messages');
const {addUsers, removeUsers, getUsers, getUsersInRoom} = require('./utils/users')

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join('__dirname',"../public");
app.use(express.static(publicDirectoryPath));


io.on('connection',(socket) => {
    console.log("New web socket connection")

    socket.on('send-message',(message,callback)=>{
        io.emit('message',generateMessages(message))
        callback("delieved!")
    })
    socket.on('disconnect',()=>{
        const user = removeUsers(socket.id)
        io.to(user.room).emit('message',generateMessages(`${user.username} has left!`))
    })
    socket.on('shareLocation',(data,callback)=>{
        io.emit('location-message',generateLocationMessage(`https://google.com/maps/?q=${data.latitude},${data.longitude}`))
        callback()
    })
    socket.on('join',(username, room, callback)=>{
        socket.join(room)
        const user = addUsers({id:socket.id, username, room})
        if(user.error){
            return callback(user.error)
        }
        callback()
        socket.emit('message', generateMessages("Welcome"))
        socket.to(user.room).broadcast.emit('message',generateMessages(`${user.username} has joined!`))
        // socket.emit, io.emit, socket.broadcast.emit
        //io.to().emit, socket.to().broadcast.emit
    })
})

server.listen(port,()=>{
    console.log("I am running at port ",port)
}) 