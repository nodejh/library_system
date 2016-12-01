const http = require('http');
const url = require('url');
const fs = require('fs');
const routerIndex = require('./routes/index');


const port = process.env.PORT || 4000;
const publicDir = './static';


const server = http.createServer((req, res) => {

});

server.listen(port, () => {
  console.log(`Server is running at port ${port}!`);
});



/**
 * 处理 HTTP 请求
 * @param  {object} req http 请求
 * @param  {object} res http 响应
 * @return {null}
 */
const handleHttp = (req, res) => {
  const method = req.method.toLowerCase();
  const parseUrl = url.parse(req.url);
  const pathname = parseUrl.pathname;
  console.log('parseUrl: ', parseUrl);
  console.log('method: ', method);
  console.log('pathname: ', pathname);
  // pathname 为 /
  //    则返回给前端 index.html
  // pathname 后缀是 .html/.css/.js 则
  //    返回对应文件
  // 其他，则根据路由返回 json
  const regexp = /(\/)|(\.html|\.css|\.js)$/;
  if (regexp.test(pathname)) {
    const path = `${publicDir}${pathname}`;
    fs.access(path, fs.F_OK, (error) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>404 File Not Found</h1>');
        res.write(`path: ${error.path}`);
        res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.createReadStream(path).pipe(res);
    });
  } else {
    // routerIndex[method](pathname, req, res);
  }
}

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
