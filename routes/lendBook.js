// 借书
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");
const time = require('./timeFormat');


app.route('/lendBook','post', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('借书...');
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
    console.log('查找证号出错，借书失败：', e);
    return getHtml("<div id='result' style='display:none'>6</div>借书失败：" + JSON.stringify(e));
  }

  // 查找书号
  const findBook = 'select bID from books where bID=?';
  try {
    const books = yield db.execSQL(findBook, [bID]);
    if (books.length === 0) {
      return getHtml("<div id='result' style='display:none'>2</div>该书号不存在");
    }
  } catch (e) {
    console.log('查找书号出错，借书失败：', e);
    return getHtml("<div id='result' style='display:none'>6</div>借书失败：" + JSON.stringify(e));
  }

  // 查询是否有超期图书
  const now = new Date().getTime();
  const findShouldReturn = 'select rID from lend ' +
    'where shouldReturnDate < ? ' +
    'and isReturn = 0 ' +
    'and rID = ?';

  try {
    const showReturnList = yield db.execSQL(findShouldReturn, [now, rID]);
    if (showReturnList.length > 0) {
      console.log('该读者有超期书未还');
      return getHtml("<div id='result' style='display:none'>3</div>该读者有超期书未还");
    }
  } catch(e) {
    console.log('查询是否有超期图书出错');
    return getHtml("<div id='result' style='display:none'>6</div>查询是否有超期图书出错，借书失败：" + JSON.stringify(e));
  }

  // 查询是否已经借阅该书
  const findLendBook = 'select bID from lend where bID=? and rID=? and isReturn=0';
  try {
    const lendBook = yield db.execSQL(findShouldReturn, [bID, rID]);
    if (lendBook.length > 0) {
      console.log('该读者已经借阅该书，且未归还');
      return getHtml("<div id='result' style='display:none'>4</div>该读者已经借阅该书，且未归还");
    }
  } catch (e) {
    console.log('查询是否已经借阅该书');
    return getHtml("<div id='result' style='display:none'>6</div>查询是否已经借阅该书出错，借书失败：" + JSON.stringify(e));
  }

  // 将借阅信息写入到 lend 表
  const insertLend = 'insert into lend(rID, bID, lendDate, shouldReturnDate, returnDate, isReturn) ' +
    'values(?, ?, ?, ?, ?, ?)';
  try {
    const lendDate = new Date().getTime();
    const shouldReturnDate = time.timestampToNextMonthDate(lendDate);
    const params = [rID, bID, lendDate, shouldReturnDate, null, 0];
    const insertRes = yield db.execSQL(insertLend, params);
    console.log('将借阅信息写入到 lend 表：', insertRes);
  } catch(e) {
    console.log('将借阅信息写入到 lend 表出错');
    return getHtml("<div id='result' style='display:none'>6</div>将借阅信息写入到 lend 表出错，借书失败：" + JSON.stringify(e));
  }

  // 更新books表
  const updateBook = 'update books set bCntLeft=bCntLeft-1 where bID=?';
  try {
    const updateRes = yield db.execSQL(updateBook, [bID]);
    console.log('更新books表：', updateRes);
    console.log('借书成功', updateRes);
    return getHtml("<div id='result' style='display:none'>0</div>成功");
  } catch (e) {
    console.log('更新books表出错');
    return getHtml("<div id='result' style='display:none'>6</div>更新books表出错，借书失败：" + JSON.stringify(e));
  }

});
