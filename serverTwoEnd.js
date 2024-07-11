const net = require('net')
const port = 7071;
const host = '127.0.0.1';
const fs = require('fs');
const path = require('path');

const server = net.createServer();

server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];
server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);
    sock.on('data', function (data) {
        const requestData = data.toString().split('\r\n');
        if (requestData[0].startsWith('GET')) {
            const requestedUrl = requestData[0].split(' ')[1];
            let contentType = 'text/html';

            if (requestedUrl === '/') {
                filePath = path.join(__dirname, 'index.html');
            } else if (requestedUrl === '/image') {
                filePath = path.join(__dirname, 'image.jpg');
                contentType = 'image/jpeg';
            }

            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                const response = `HTTP/1.1 200 OK\r\nContent-Type: ${contentType}\r\nContent-Length: ${fileData.length}\r\n\r\n`;
                const responseData = Buffer.concat([Buffer.from(response), fileData]);
                sock.write(responseData);
            } else {
                const notFoundResponse = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\n\r\n404 Not Found';
                sock.write(notFoundResponse);
            }
        }

        sock.end();
    });

    sock.on('close', function (data) {
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
    });

    sock.on('error', function (data) {
        console.log("Ошибка: " + data);
    });

});