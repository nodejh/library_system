const HTM=require('../lib').html;

function getHtml(content) {
  return HTM.begin+content+HTM.end
};

module.exports = getHtml;
