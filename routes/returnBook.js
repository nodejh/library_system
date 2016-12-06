// 还书
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");
const time = require('./timeFormat');


app.route('/returnBook','post', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('还书...');
  const rID = req.body.rID;
  const bID = req.body.bID;
  // 查找证号
  const findReader = 'select rID from readers where rID=?';
  try {
    const readers = yield db.execSQL(findReader, [rID]);
    if (readers.length === 0) {
      return getHtml("<div id='result' style='display:none'>1</div>该证号不存在");
    }
  } catch(e) {
    console.log('查找证号出错，还书失败：', e);
    return getHtml("<div id='result' style='display:none'>6</div>还书失败：" + JSON.stringify(e));
  }

  // 查找书号
  const findBook = 'select bID from books where bID=?';
  try {
    const books = yield db.execSQL(findBook, [bID]);
    if (books.length === 0) {
      return getHtml("<div id='result' style='display:none'>2</div>该书号不存在");
    }
  } catch (e) {
    console.log('查找书号出错，还书失败：', e);
    return getHtml("<div id='result' style='display:none'>6</div>还书失败：" + JSON.stringify(e));
  }

  // 查询是否已经借阅该书
  const findLendBook = 'select bID from lend where bID=? and rID=? and isReturn=0';
  try {
    const lendBook = yield db.execSQL(findLendBook, [bID, rID]);
    if (lendBook.length === 0) {
      console.log('该读者并未借阅该书');
      return getHtml("<div id='result' style='display:none'>3</div>该读者并未借阅该书");
    }
  } catch (e) {
    console.log('查询是否已经借阅该书');
    return getHtml("<div id='result' style='display:none'>6</div>查询是否已经借阅该书出错，还书失败：" + JSON.stringify(e));
  }

  // 更新lend表
  const updateLend = 'update lend set returnDate=?, isReturn=1 where rID=? and bID=?';
  try {
    const params = [new Date().getTime(), rID, bID];
    const updateRes = yield db.execSQL(updateLend, params);
    console.log('更新lend表：', updateRes);
  } catch(e) {
    console.log('将借阅信息写入到 lend 表出错');
    return getHtml("<div id='result' style='display:none'>6</div>将借阅信息写入到 lend 表出错，还书失败：" + JSON.stringify(e));
  }

  // 更新books表
  const updateBook = 'update books set bCntLeft=bCntLeft+1 where bID=?';
  try {
    const updateRes = yield db.execSQL(updateBook, [bID]);
    console.log('更新books表：', updateRes);
    console.log('还书成功', updateRes);
    return getHtml("<div id='result' style='display:none'>0</div>成功");
  } catch (e) {
    console.log('更新books表出错');
    return getHtml("<div id='result' style='display:none'>6</div>更新books表出错，还书失败：" + JSON.stringify(e));
  }

});
