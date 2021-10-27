'use strict';

var _toc = require('./command/toc');

var _issue = require('./command/issue');

var _articles = require('./command/articles');

var express = require('express');

var app = express();
var port = 3000;
app.get('/', function(req, res) {
  res.send('Hello World! issues2md！');
});
app.get('/toc', function(req, res) {
  (0, _toc.exportIssuesBlogToc)('https://github.com/yanyue404/blog');
  res.send('Hello World!');
});
app.get('/issue', function(req, res) {
  (0, _issue.exportSimgleIssue)('https://github.com/yanyue404/blog/issues/221');
  res.send('Hello World!');
});
app.get('/articles', function(req, res) {
  (0, _articles.exportIssuesBlogArticles)('https://github.com/yanyue404/blog');
  res.send('Hello World!');
});
app.listen(port, function() {
  console.log('Example app listening at http://localhost:'.concat(port));
});
