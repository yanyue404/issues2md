'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.exportSimgleIssue = void 0;

var _http = require('../http');

var _utils = require('../utils');

var fs = require('fs');

var cheerio = require('cheerio');

function getIssues(fetchUrl) {
  return (0, _http._get)(fetchUrl)
    .then(function(response) {
      var $ = cheerio.load(response); // 传入页面内容

      var title = $('.js-issue-title')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd();

      var content = _utils.turndownService.turndown($('table').html());

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
        (0, _utils.prettierFormatMarkdown)(obj.content),
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
