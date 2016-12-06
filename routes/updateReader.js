// 修改读者信息
const app=require('../WebApp');
const getHtml = require('./getHtml');
const db=require("../coSqlite3");


app.route('/updateReader','post', function*(req, res) {
  // console.log('req.body: ', req.body);
  console.log('修改读者信息...');
  const rID = req.body.rID;
  const rName = req.body.rName;
  const rSex = req.body.rSex;
  const rDept = req.body.rDept;
  const rGrade = req.body.rGrade;
  if (!rID) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：请填写证号");
  }
  if (rID.length > 8) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：证号最多8个字符");
  }
  if (!rName) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：请填写姓名");
  }
  if (rName.length > 10) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：姓名最多10个字符");
  }
  if (!rSex) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：请填写性别");
  }
  if (!(rSex === '男' || rSex === '女')) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：性别应该填写“男”或者“女”");
  }
  if (!rDept) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：请填写系名");
  }
  if (rDept.length > 10) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：系名最多10个字符");
  }
  if (!rGrade) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：请填写年级");
  }
  if (!(/^\d+$/.test(rGrade))) {
    return getHtml("<div id='result' style='display:none'>2</div>提交的参数有误：年级应该是正整数");
  }

  const sqlFind = 'select rID from readers where rID=?';
  try {
    const readers = yield db.execSQL(sqlFind, [rID]);
    if (readers.length === 0) {
      console.log('[ERROR]该证号不存在：', JSON.stringify(readers));
      return getHtml("<div id='result' style='display:none'>1</div>该证号不存在");
    }

    const sqlUpdate = 'update readers set rName=?, rSex=?, rDept=?,rGrade=? where rID=?';
    const params = [rName, rSex, rDept, rGrade, rID];

    try {
      yield db.execSQL(sqlUpdate, params);
      // console.log(params);
      console.log('修改读者信息成功！');
      return getHtml("<div id='result' style='display:none'>0</div>成功");
    } catch (e) {
      console.log('[ERROR]修改读者信息出错：', JSON.stringify(e));
      return getHtml("<div id='result' style='display:none'>3</div>修改读者信息出错：" + JSON.stringify(e));
    }

  } catch(e) {
    console.log('[ERROR]查询数据库出错：', JSON.stringify(e));
    return getHtml("<div id='result' style='display:none'>3</div>修改读者信息出错：" + JSON.stringify(e));
  }
});
