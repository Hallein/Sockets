const express = require('express');
const routes = express.Router();

// Device request routes
routes.post('/temperature', (req, res) => {
    const {id, secret} = req.body;

    if(!id || !secret){
        res.sendStatus(400);
    }
    
    // TODO: validate device's id and secret
    
    // TODO: save data to DB
    //
    
    const {namespace, room, value} = req.body;
    const io = req.io;
    io.of(namespace).in(room).emit('temperature', value);

    res.sendStatus(200);
});

module.exports = routes;

/*

POST http://localhost:8080/device/temperature
Example body data
{
	"id": "device_01",
	"secret": "hola",
	"namespace": "/device_01",
	"room": "temperature",
	"value": 12345
}

*/