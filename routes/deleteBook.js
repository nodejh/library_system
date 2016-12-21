'use strict';
// 删除/减少书籍
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");


app.route('/deleteBook','post', function*(req, res) {
  console.log('增加书的数量...');
  const bID = req.body.bID;
  const bCnt = req.body.bCnt;
  if (!bID) {
    return getHtml("<div id='result' style='display:none'>3</div>请填写书号");
  }
  if (!bCnt) {
    return getHtml("<div id='result' style='display:none'>3</div>请填写数量");
  }
  if (!(parseInt(bCnt, 10) > 0)) {
    return getHtml("<div id='result' style='display:none'>3</div>数量应该>0");
  }

  const sqlFind = 'select bCnt,bCntLeft from books where bID=?';
  try {
    const books = yield db.execSQL(sqlFind, [bID]);
    if (books.length === 0) {
      console.log('[ERROR]该书不存在：', JSON.stringify(books));
      return getHtml("<div id='result' style='display:none'>1</div>该书不存在");
    }
    // console.log('books: ', books);
    // 剩余数目 < 即将减去的数目，则不能减少
    if (parseInt(books[0].bCntLeft, 10) < parseInt(bCnt, 10)) {
      return getHtml("<div id='result' style='display:none'>2</div>减少的数量大于该书目前在库数量");
    }
    const bCntLeftOld = books[0].bCntLeft;
    const bCntOld = books[0].bCnt; // 库存总数
    const bCntNew = parseInt(bCntOld, 10) - parseInt(bCnt, 10); // 减去后剩余的数目
    const bCntLeftNew = parseInt(bCntLeftOld, 10) - parseInt(bCnt, 10);
    let sqlUpdate = '';
    let params = [];
    // 判断减少书籍数量后，还剩余的书籍数目
    if (bCntNew === 0) {
      // 删除书籍
      sqlUpdate = 'delete from books where bID=?';
      params = [bID];
    } else if (bCntNew > 0) {
      // 更新书籍数目
      sqlUpdate = 'update books set bCnt=?,bCntLeft=? where bID=?';
      params = [bCntNew, bCntLeftNew, bID];
    } else {
      // 出错，打算减少的数量大于该书目前在库（未借出）的数
      console.log('[ERROR]减少的数量大于该书目前在库数量');
      return getHtml("<div id='result' style='display:none'>2</div>减少的数量大于该书目前在库数量");
    }

    console.log('bCntNew: ', bCntNew);
    if (!(/\d+/.test(bCntNew))) {
      console.log('[ERROR]减少新书出错，数量格式错误');
      return getHtml("<div id='result' style='display:none'>2</div>减少新书出错，数量格式错误");
    }
    try {
      yield db.execSQL(sqlUpdate, params);
      console.log('减少书的数量成功！');
      return getHtml("<div id='result' style='display:none'>0</div>成功");
    } catch (e) {
      console.log('[ERROR]减少书的数量出错：', JSON.stringify(e));
      return getHtml("<div id='result' style='display:none'>2</div>减少书的数量出错：" + JSON.stringify(e));
    }

  } catch(e) {
    console.log('[ERROR]查询数据库出错：', JSON.stringify(e));
    return getHtml("<div id='result' style='display:none'>2</div>查询数据库出错：" + JSON.stringify(e));
  }

  return getHtml("<div id='result' style='display:none'>0</div>成功");
});
