const http = require('http');
const url = require('url');
const fs = require('fs');


const port = process.env.PORT || 4000;
const publicDir = './static';


const server = http.createServer((req, res) => {
  const method = req.method;
  console.log('method: ', method);
  let data = '';
  switch (method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    default:
      handlePost(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}!`);
});


/**
 * 处理 GET 请求
 * @param req
 * @param res
 */
const handleGet = (req, res) => {
  const pathname = url.parse(req.url).pathname === '/' ?
    `/index.html` : url.parse(req.url).pathname;
  const path = `${publicDir}${pathname}`;
  console.log('path: ', path);
  console.log('pathname: ', pathname);
  fs.access(path, fs.F_OK, (error) => {
    console.log('error: ', error);
    if (error) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write('<h1>File Not Found</h1>');
      res.write(`path: ${error.path}`);
      res.end();
      return false;
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(path).pipe(res);
  });
};


/**
 * 处理 POST/PUT/DELETE 等通过body传输数据的请求
 * @param req
 * @param res
 */
const handlePost = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const json = {
      data: body,
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(json));
    res.end();
  });
};