const http = require('http');
const fs = require('fs');

const routing = {
  '/': readFile('dist/index.html'),
  '/main.js': readFile('dist/main.js'),
  '/doc.json': readFile('assets/doc.json')
};

const types = {
  object: JSON.stringify,
  string: s => s,
  undefined: () => 'not found',
  function: (fn, req, res) => JSON.stringify(fn(req, res))
};

function readFile(filename, format = 'utf8') {
  return fs.readFileSync(filename, format);
}

http
  .createServer((req, res) => {
    const data = routing[req.url];
    const type = typeof data;
    const serializer = types[type];
    const result = serializer(data, req, res);
    res.end(result);
  })
  .listen(8000);
