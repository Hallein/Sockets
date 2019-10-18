const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const url = require('url');
const expressJwt = require('express-jwt');

// Dotenv initialization
require('dotenv').config();

// Set JSON type to request's body
app.use(express.json())

// Static files path
app.use(express.static(__dirname + '/public'));

// Middleware to pass 'io' object to routes file under /device
app.use('/api/device', function(req, res, next){
    req.io = io;
    next();
});

// Middleware JWT to protect routes
const SECRET = { secret: process.env.SECRET };
app.use(expressJwt(SECRET).unless({ 
    path: ["/api/auth/login", "/api/device/temperaturex"] 
}));

// Device routes
const deviceRoutes = require('./routes/device');
app.use('/api/device', deviceRoutes);

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Server start
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // TODO: connect to mongodb
    //
});

// Sockets connection setup
io.on('connection', function(socket) {
    var {namespace, room} = url.parse(socket.handshake.url, true).query;

    // Verify if namespace exists
    if( !io.nsps[namespace] ){

        io.of(namespace).on('connection', function (socket) {
            console.log("Socket", socket.id, "has connected to namespace", namespace);
    
            socket.on('join_room', room => {
                socket.join(room, () => {
                    console.log("Socket", socket.id, "has joined the room", room);
                })
            });

            socket.on('leave_room', room => {
                socket.leave(room, () => {
                    console.log("Socket", socket.id, "has left the room", room);
                })
            });

        });

    }
    
    // Socket disconnection handler
    socket.on('disconnect', () => {
        console.log("Socket", socket.id, "disconnected");
    });
});

