'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.exportIssuesBlogArticles = void 0;

var _utils = require('../utils');

var fs = require('fs');

var cheerio = require('cheerio');

var filenamify = require('filenamify');

var TurndownService = require('turndown');

var turndownPluginGfm = require('turndown-plugin-gfm');

var config = require('../../config/config.json');

var turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});
var gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

function getAPI(blogURL) {
  return new Promise(function(resolve) {
    (0, _utils.fetch)(blogURL + '/issues').then(function(html_string) {
      var $ = cheerio.load(html_string); // 传入页面内容

      var obj = {};
      var totalPage = $('.pagination')
        .find('.current')
        .data('total-pages');
      obj.totalPage = Number(totalPage);
      var numbers = $('.states a')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd()
        .split(' ')[0];
      obj.numbers = Number(numbers);
      var urlList = [];

      for (var i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          config.github.blog + '/issues?page=' + i + ' is:issue is:open';
      }

      obj.fetchList = urlList; // 获取所有  Issues 数据,再返回

      _getAllPageIssues(urlList, function(issues) {
        obj.blogs = issues;
        (0, _utils.saveData_dev)(obj, 'api.json', function() {
          resolve(obj);
        });
      });
    });
  })['catch'](function(error) {
    console.log(error);
  });
}

function _getAllPageIssues(fetchUrlsArray, callback) {
  var result = [];
  Promise.all(
    fetchUrlsArray.map(function(url) {
      return _getSimglePageIssuesMessage(url);
    }),
  )
    .then(function(res) {
      for (var i = 0; i < res.length; i++) {
        result = result.concat(res[i]);
      }

      result.sort(function(x, y) {
        return Number(y.id) - Number(x.id);
      });
      callback(result);
    })
    ['catch'](function(err) {
      console.log(err);
    });
}

function _getSimglePageIssuesMessage(fetchUrl) {
  return (0, _utils.fetch)(fetchUrl)
    .then(function(html_string) {
      var $ = cheerio.load(html_string); // 传入页面内容

      var list_array = [];
      $('.Box .Box-row').each(function() {
        // 像jQuery一样获取对应节点值
        var obj = {};
        obj.id = $(this)
          .attr('id')
          .slice(6);
        obj.title = $('#issue_' + obj.id + '_link')
          .text()
          .trimStart()
          .trimEnd();
        var labelText = [];
        $(this)
          .find('.IssueLabel')
          .each(function(i, elem) {
            labelText[i] = $(this)
              .text()
              .trimStart()
              .trimEnd();
          });
        obj.labels = labelText;
        obj.time = $(this)
          .find('relative-time')
          .attr('datetime')
          .slice(0, 10);
        list_array.push(obj);
      });
      return list_array;
    })
    ['catch'](function(error) {
      console.log(error);
    });
}

function exportAllMarkdown() {
  var SETING_FILE = 'docs/json/api.json';

  if (fs.existsSync(SETING_FILE)) {
    fs.readFile(SETING_FILE, 'utf8', function(err, data) {
      if (err) console.log(err);
      var issues = JSON.parse(data).blogs; // 导出

      issues.forEach(function(issue) {
        if (issue && issue.time && issue.title && issue.id) {
          _singleMarkdownFileExport(issue.time + '-' + issue.title, issue.id);
        } else {
          console.log('导出出问题:', {
            issue: issue,
          });
        }
      });
    });
  } else {
    console.log('not find ' + SETING_FILE);
  }
}

function _singleMarkdownFileExport(name, issuesID) {
  var fileName = filenamify(name);
  var exportByYear = config.year;
  var fileDirectory = exportByYear
    ? 'docs/' + fileName.slice(0, 4) + '/'
    : 'docs/';
  var url = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接

  return (0, _utils.fetch)(url)
    .then(function(html_string) {
      var $ = cheerio.load(html_string); // 传入页面内容

      var content = turndownService.turndown($('table').html());
      (0, _utils.createFile)(fileDirectory, fileName + '.md', content);
    })
    ['catch'](function(error) {
      return console.log(
        'Markdown - ' + (0, _utils.addZero)(issuesID, 3) + ' - ' + error,
      );
    });
}

var exportIssuesBlogArticles = function exportIssuesBlogArticles(blog_url) {
  var promise = getAPI(blog_url); // 发起抓取

  promise.then(function(response) {
    console.log('kaishi -----');
    exportAllMarkdown();
  });
};

exports.exportIssuesBlogArticles = exportIssuesBlogArticles;
