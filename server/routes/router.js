const path = require('path');
const fs = require('fs');
const logger = require('./logger');


const publicDir = path.resolve(__dirname, './../static');
const router = {};


router.index = (req, res) => {
  logger.info('首页...');
  const filepath = `${publicDir}/index.html`;
  fs.access(filepath, fs.F_OK, (error) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>404 File Not Found</h1>');
      res.write(`path: ${error.path}`);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(filepath).pipe(res);
    }
  });
};


module.exports = router;
