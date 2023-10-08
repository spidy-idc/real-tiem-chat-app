const http = require('http');
const express = require('express');
const hbs = require('hbs');
const port = process.env.PORT;
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config()

const app = express();

const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

require('./db/mongoose');

app.use(express.static(path.join(__dirname, './public')));

const User = require('./models/user')
const Message = require('./models/chats')

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chats')

app.use(express.json());
app.use(cookieParser());
app.use(userRoutes);
app.use(chatRoutes);


//sockets code
io.on('connection', socket => {
    console.log('Connected to sockets');
    socket.on('joinRoom', room => {
        socket.join(room);
        console.log('Joined room ' + room);
    })

    socket.on('sendMessage', async (message, cb) => {
        try {
        const dest = message.dest;
        delete message.dest;
        const msg = new Message(message);
        const savedMessage = await msg.save()
        socket.emit('message', savedMessage);
        socket.in(dest).emit('message', message);
        console.log(dest);
        cb()
        }
        catch(e) {
            cb('Error occured')
        }
    })
});

server.listen(4444, () => console.log('Server Started!'));