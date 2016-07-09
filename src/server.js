const http = require('http');
const handler = require('../server/handler.js');

const server = http.createServer(handler);
const port = process.env.PORT || 4000;

server.listen(port);

module.exports = server;
