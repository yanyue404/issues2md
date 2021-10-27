'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.exportSimgleIssue = void 0;

var _utils = require('../utils');

var _index = require('./index');

var fs = require('fs');

function getIssues(fetchUrl) {
  return _index.axios
    .get(fetchUrl)
    .then(function(response) {
      var html_string = response.data.toString(); // 获取网页内容

      var $ = _index.cheerio.load(html_string); // 传入页面内容

      var title = $('.js-issue-title')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd();

      var content = _index.turndownService.turndown($('table').html());

      return {
        title: title,
        content: content,
      };
    })
    ['catch'](function(err) {
      console.log(err);
    });
}

var exportSimgleIssue = function exportSimgleIssue(issues_url) {
  getIssues(issues_url)
    .then(function(obj) {
      var dir = 'docs/';
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      fs.writeFile(
        'docs/'.concat(obj.title, '.md'),
        (0, _utils.formatMarkdown)(obj.content),
        function(err) {
          if (err) throw err;
          console.log('The file has been saved!');
        },
      );
    })
    ['catch'](function(err) {
      console.log(err);
    });
};

exports.exportSimgleIssue = exportSimgleIssue;
