var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');

// Set JSON type to request body
app.use(express.json())

// Static files path
app.use(express.static(__dirname + '/public'));

// Middleware to pass 'io' object to routes file under /device
app.use('/device', function(req, res, next){
    req.io = io;
    next();
});

// Routes
const deviceRoutes = require('./routes/sensor');
app.use('/device', deviceRoutes);


// Server start
server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
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

