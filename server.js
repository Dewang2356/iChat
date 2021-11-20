const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 3000
const { addUser, getUser, deleteUser, getUsers } = require('./users')

app.use(cors())

io.on('connection', (socket) => {
    socket.on('login',  (name, room ) => {
        const { user, error } = addUser(socket.id, name, room)
        
        socket.emit('error',error) 
        socket.join(room)

        if (!error) {socket.broadcast.to(room).emit('notification', { title: `${name} joined the chat` })}
        // io.in(room).emit('notification', { title: `${name} joined the chat` })
        io.in(room).emit('users', getUsers(room))
        
        
        // callback()
    })

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('message', message);
        socket.broadcast.to(user.room).emit('typing', {name:"",val:""});
        // socket.broadcast.(user.room).emit('message', { user: user.name, text: message });
    })

    socket.on("disconnect", () => {
        
        const user = deleteUser(socket.id)
        if (user) {
            socket.broadcast.to(user.room).emit('notification', { title: `${user.name} left the chat` });
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })
    socket.on("typing",(name,room,val)=>{
           
        socket.broadcast.to(room).emit('typing', {name:name,val:val});
        // socket.broadcast.to(room).emit('over', "");
        // console.log(val);

    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})
app.get('/chat', (req, res) => {
    res.sendFile(__dirname+'/public/chat.html')
})
app.use(express.static('public'));
http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})