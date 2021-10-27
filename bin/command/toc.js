'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.exportIssuesBlogToc = void 0;

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

var _index = require('./index');

var _utils = require('../utils');

var fs = require('fs');

process.on('uncaughtException', function(err) {
  console.log(err.stack);
  console.log('NOT exit...');
});
process.once('SIGUSR2', function() {
  process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', function() {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
}); // 接口文档 https://docs.github.com/cn/rest/reference/issues
// https://api.github.com/repos/yanyue404/blog/issues?state=open&page=1&per_page=100
// 配置代理服务器信息

var db_issues = {}; // https://github.com/yanyue404/blog

function getAllPageIssuesInfo(_x) {
  return _getAllPageIssuesInfo.apply(this, arguments);
}

function _getAllPageIssuesInfo() {
  _getAllPageIssuesInfo = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee2(
      blogRequestURL,
    ) {
      var queryKeywords, pageNo, createSingleRequestURL, loopRequest;
      return _regenerator['default'].wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              if (
                !(
                  blogRequestURL &&
                  blogRequestURL.split('https://github.com/')[1]
                )
              ) {
                _context2.next = 11;
                break;
              }

              queryKeywords = blogRequestURL.split('https://github.com/')[1];
              pageNo = 1;
              db_issues.baseURL = blogRequestURL;
              db_issues.queryKeywords = queryKeywords;
              db_issues.blogsOrigin = [];

              createSingleRequestURL = function createSingleRequestURL(pageNo) {
                return 'https://api.github.com/repos/'
                  .concat(queryKeywords, '/issues?state=open&page=')
                  .concat(pageNo, '&per_page=100');
              };

              loopRequest = function loopRequest(callback) {
                _index.axios
                  .get(createSingleRequestURL(pageNo))
                  .then(function(resp) {
                    if (resp.status == 200 && resp.data.length > 0) {
                      console.log(
                        '\u8BF7\u6C42\u5F97\u5230\u7B2C '.concat(
                          pageNo,
                          ' \u9875\u7ED3\u679C\uFF0C',
                        ),
                        '得到 ' + resp.data.length + ' 条数据。',
                      );
                      db_issues.blogsOrigin = db_issues.blogsOrigin.concat(
                        resp.data,
                      ); // 下一页

                      if (resp.data.length == 100) {
                        pageNo++;
                        setTimeout(function() {
                          loopRequest(callback);
                        }, 1500);
                      }

                      if (resp.data.length > 0 && resp.data.length < 100) {
                        console.log(
                          '结果出来了',
                          '共有' + db_issues.blogsOrigin.length + '条',
                        );
                        callback(db_issues);
                      }
                    } else {
                      console.log('Error: 没有数据或请求出错！');
                    }
                  });
              };

              return _context2.abrupt(
                'return',
                new Promise(function(resolve, reject) {
                  loopRequest(function(result) {
                    console.log('Get loopRequest result ---------------');
                    resolve(result);
                  });
                }),
              );

            case 11:
              throw new Error('请求地址有误，请校验！');

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2);
    }),
  );
  return _getAllPageIssuesInfo.apply(this, arguments);
}

var IssuesInfoToToc = function IssuesInfoToToc(result) {
  var labelsArr = [];
  var articles = {};
  result.blogs.forEach(function(v) {
    var label = v.labels[0];

    if (!labelsArr.includes(label)) {
      labelsArr.push(label);
      articles[label] = [];
      articles[label].push('['.concat(v.title, '](').concat(v.url, ')'));
    } else {
      articles[label].push('['.concat(v.title, '](').concat(v.url, ')'));
    }
  }); // '-[npm&yarn](https://github.com/yanyue404/blog/issues/7)[开发者笔记]'

  var header = '<h1>TOC</h1><br>';
  var sort = '<h2>\u5206\u7C7B</h2><br>';
  sort += '<ul>';
  labelsArr.forEach(function(category) {
    sort += '<li><a href="#'
      .concat(category, '"><strong>')
      .concat(category, '</strong></a></li>');
  });
  sort += '</ul><br>';
  var content = '<h2>\u6587\u7AE0</h2><br>';

  for (var key in articles) {
    content += '<h3>'.concat(key, '</h3><br>');
    content += '<ul>';
    articles[key].forEach(function(m, index, arr) {
      content += '<li href="'.concat(m, '">').concat(m, '</li>');

      if (index === arr.length - 1) {
        content += '<br>';
      }
    });
    content += '</ul>';
  }

  var markdown = _index.turndownService.turndown(
    '<body>' + header + sort + content + '</body>',
  );

  var dir = 'docs/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  var TocContent = (0, _utils.formatMarkdown)(markdown).replace(/\\/g, '');
  fs.writeFile('docs/Toc.md', TocContent, function(err) {
    if (err) throw err;
    console.log('The file has been saved!');
    db_issues = {};
  });
};

var exportIssuesBlogToc = /*#__PURE__*/ (function() {
  var _ref = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee(fetch_url) {
      var result;
      return _regenerator['default'].wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return getAllPageIssuesInfo(fetch_url);

            case 2:
              result = _context.sent;
              result.blogs = result.blogsOrigin.map(function(o) {
                return {
                  title: o.title,
                  url: o.html_url,
                  labels: o.labels.map(function(item) {
                    return item.name;
                  }),
                };
              });
              IssuesInfoToToc(result);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );

  return function exportIssuesBlogToc(_x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.exportIssuesBlogToc = exportIssuesBlogToc;
