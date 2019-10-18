
var connect = function (namespace) {
    return io.connect(namespace, {
       query: 'namespace=' + namespace,
	   resource: "socket.io"
    });
}

var socket = connect('/device_01');
socket.emit('join_room', 'temperature')

socket.on('hola', message => console.log(message))

socket.on('temperature', message => console.log(message))

socket.on('reconnect', () => {
    console.log('reconnecting...')
	socket.emit('join_room', 'temperature')
});
