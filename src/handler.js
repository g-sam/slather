const paths = require('../server/paths.js');

function handler(request, response) {
  const url = request.url;
  if (url === '/') {
    paths.index(request, response);
  } else if (url.includes('/public')) {
    paths.pub(request, response);
  } else {
    response.writeHead(404);
    response.end('The URL you have requested does not exist');
  }
}

module.exports = handler;
