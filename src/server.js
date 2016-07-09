const http = require('http');
const handler = require('./handler.js');

const server = http.createServer(handler);
const port = process.env.PORT || 4000;

server.listen(port);
console.log(`server listening on port ${port}`);

module.exports = server;
