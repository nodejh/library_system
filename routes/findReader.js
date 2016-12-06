// 查询读者
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");
const time = require('./timeFormat');


app.route('/findReader', 'post', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('查询读者...');
  const rID = req.body.rID;
  const rName = req.body.rName;
  const rSex = req.body.rSex;
  const rDept = req.body.rDept;
  const rGrade0 = req.body.rGrade0;
  const rGrade1 = req.body.rGrade1;

  let sql = 'select * from readers where ';

  if (rID) {
    sql += `rID like '%${rID}%' and `;
  }
  if (rName) {
    sql += `rName like '%${rName}%' and `;
  }
  if (rSex) {
    sql += `rSex like '%${rSex}%' and `;
  }
  if (rDept) {
    sql += `rDept like '%${rDept}%' and `;
  }
  if (rGrade0) {
    sql += `rGrade >= ${parseInt(rGrade0, 10)} and `;
  }
  if (rGrade1) {
    sql += `rGrade <= ${parseInt(rGrade1, 10)} and `;
  }
  // 添加一个永远为真的条件，以便拼接完整个 SQL
  sql += ' 1';
  try {
    console.log('sql: ', sql);
    const readers = yield db.execSQL(sql);
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
    console.log('查询读者成功：', readers);
    return getHtml(html);
  } catch(e) {
    console.log('查询读者失败：', JSON.stringify(e));
    return getHtml("<div id='result' style='display:none'>2</div>查询读者失败：" + JSON.stringify(e));
  }

});
