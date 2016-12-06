// 查询书籍
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");
const time = require('./timeFormat');


app.route('/findBook', 'post', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('查询书籍...');
  const bID = req.body.bID;
  const bName = req.body.bName;
  const bPub = req.body.bPub;
  const bDate0 = req.body.bDate0;
  const bDate1 = req.body.bDate1;
  const bAuthor = req.body.bAuthor;
  const bMem = req.body.bMem;

  let sql = 'select * from books where ';

  if (bID) {
    sql += `bID like '%${bID}%' and `;
  }
  if (bName) {
    sql += `bName like '%${bName}%' and `;
  }
  if (bPub) {
    sql += `bPub like '%${bPub}%' and `;
  }
  if (bAuthor) {
    sql += `bAuthor like '%${bAuthor}%' and `;
  }
  if (bMem) {
    sql += `bMem like '%${bMem}%' and `;
  }
  if (bDate0 && /^\d{4}-\d{2}-\d{2}$/.test(bDate0)) {
    sql += `bDate >= ${new Date(bDate0).getTime()} and `;
  }
  if (bDate1 && /^\d{4}-\d{2}-\d{2}$/.test(bDate1)) {
    sql += `bDate <= ${new Date(bDate1).getTime()} and `;
  }
  // 添加一个永远为真的条件，以便拼接完整个 SQL
  sql += ' 1';
  try {
    console.log('sql: ', sql);
    const books = yield db.execSQL(sql);
    let html = '<table border=1 id=\'result\'>' +
      '<tr>' +
      '<td>书号</td>' +
      '<td>书名</td>' +
      '<td>总数量</td>' +
      '<td>在库数量</td>' +
      '<td>出版社</td>' +
      '<td>出版日期</td>' +
      '<td>作者</td>' +
      '<td>内容摘要</td>' +
      '</tr>';
    books.map((item) => {
      console.log('item: ', item);
      html += '<tr>' +
        `<td>${item.bID}</td>` +
        `<td>${item.bName}</td>` +
        `<td>${item.bCnt}</td>` +
        `<td>${item.bCntLeft}</td>` +
        `<td>${item.bPub}</td>` +
        `<td>${time.timestampToDate(item.bDate)}</td>` +
        `<td>${item.bAuthor}</td>` +
        `<td>${item.bMem}</td>` +
      '</tr>';
    });
    html += '</table>';
    console.log('查询书籍成功：', books);
    return getHtml(html);
  } catch(e) {
    console.log('查询书籍失败：', JSON.stringify(e));
    return getHtml("<div id='result' style='display:none'>2</div>查询书籍失败：" + JSON.stringify(e));
  }

});
