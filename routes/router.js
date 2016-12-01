const methods = [
  'get',
  'post',
  'put',
  'delete',
];


const router = {};

methods.map(item => {
  router[item] = (url, req, res, callback) => {
    console.log('url: ', url);
  };
});


module.exports = router;
