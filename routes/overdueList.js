// 超期未还读者列表
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");
const time = require('./timeFormat');


app.route('/overdueList', 'get', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('超期未还读者列表...');

  const sql = 'select * from lend ' +
    'left join readers ' +
    'on lend.rID = readers.rID ' +
    'where shouldReturnDate < ? and isReturn=0';

  try {
    console.log('sql: ', sql);
    const readers = yield db.execSQL(sql, [new Date().getTime()]);
    let html = '<table border=1 id=\'result\'>';
      // '<tr>' +
      // '<td>证号</td>' +
      // '<td>姓名</td>' +
      // '<td>性别</td>' +
      // '<td>系名</td>' +
      // '<td>年级</td>' +
      // '</tr>';
    readers.map((item) => {
      console.log('item: ', item);
      html += '<tr>' +
        `<td>${item.rID}</td>` +
        `<td>${item.rName}</td>` +
        `<td>${item.rSex}</td>` +
        `<td>${item.rDept}</td>` +
        `<td>${item.rGrade}</td>` +
      '</tr>';
    });
    html += '</table>';
    console.log('查询超期未还读者列表成功：', readers);
    return getHtml(html);
  } catch(e) {
    console.log('查超期未还读者列表失败：', JSON.stringify(e));
    return getHtml("<div id='result' style='display:none'>2</div>查询超期未还读者列表失败：" + JSON.stringify(e));
  }

});
