function timestampToDate(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return `${year}-${month}-${day}`;
}


function timestampToDatetime(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return `${year}-${month}-${day} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}


function timestampToNextMonthDate(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var year = date.getFullYear();
  var month = date.getMonth() + 2;
  var day = date.getDate();
  if (month === 13) {
    year += 1;
    month = 1;
  }
  return `${year}-${month}-${day}`;
}


module.exports = {
  timestampToDate,
  timestampToDatetime,
};
