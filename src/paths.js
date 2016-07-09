const fs = require('fs');

function index(request, response) {
  fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
    if (err) throw err;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);
  });
}

function pub(request, response) {
  const url = request.url;
  let ext = url.split('.')[1];
  while (ext.includes('.')) {
    ext = ext.split('.')[1];
  }
  fs.readFile(`${__dirname}/..${url}`, (err, data) => {
    if (err) throw err;
    response.writeHead(200, { 'Content-Type': `text/${ext}` });
    response.end(data);
  });
}


module.exports = {
  index,
  pub,
};
