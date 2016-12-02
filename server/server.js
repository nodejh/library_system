const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const logger = require('./routes/logger');
const router = require('./routes/router');


const port = process.env.PORT || 4000;
const publicDir = path.resolve(__dirname, './static');


/**
 * 处理 HTTP 请求
 * @param  {object} req http 请求
 * @param  {object} res http 响应
 * @return {null}   null
 */
const handleHttp = (req, res) => {
  const method = req.method.toLowerCase();
  const parseUrl = url.parse(req.url);
  const pathname = parseUrl.pathname;
  logger.info('parseUrl: ', parseUrl);
  logger.info('method: ', method);
  logger.info('pathname: ', pathname);
  // pathname 为 /
  //    则返回给前端 index.html
  // pathname 后缀是 .html/.css/.js 则
  //    返回对应文件
  // 其他，则根据路由返回 json
  const regexp = /(\.html|\.css|\.js)$/;
  if (regexp.test(pathname)) {
    // 处理静态文件
    const filepath = `${publicDir}${pathname}`;
    fs.access(filepath, fs.F_OK, (error) => {
      if (error) {
        logger.error(error);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>404 File Not Found</h1>');
        res.write(`path: ${error.path}`);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(filepath).pipe(res);
      }
    });
  } else if (pathname === '/' || pathname === '/index.html') {
    // 返回首页页面
    router.index(req, res);
  } else if (method === 'get' && pathname === '/api/init') {
    // 初始化数据库
    logger.info('aaaa');
  } else {
    // 没有匹配的路由，返回首页页面
    logger.info('没有匹配的路由，返回首页页面');
    router.index(req, res);
  }
};


/**
 * 处理 POST/PUT/DELETE 等通过body传输数据的请求
 * @param req
 * @param res
 * @return {null} null
 */
// const handlePost = (req, res) => {
//   let body = '';
//   req.on('data', (chunk) => {
//     body += chunk;
//   });
//   req.on('end', () => {
//     const json = {
//       data: body,
//     };
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.write(JSON.stringify(json));
//     res.end();
//   });
// };


const server = http.createServer((req, res) => {
  handleHttp(req, res);
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}!`);
});
