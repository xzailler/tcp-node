const net = require('net');
const fs = require("fs");
const client = new net.Socket();
const port = 7071;
const host = '127.0.0.1';
client.connect(port, host, function () {
    console.log('Connected');
    client.write("Hello From Client " + client.address().address);
    client.end();
});
client.on('data', function (data) {
    console.log('Server Says : ' + data);
});
client.on('close', function () {
    console.log('Connection closed');
});