#!/usr/bin/env node
'use strict';

var _typeof = require('@babel/runtime/helpers/typeof');

var commander = _interopRequireWildcard(require('commander'));

var _toc = require('./command/toc');

var _issue = require('./command/issue');

var _articles = require('./command/articles');

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop,
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== 'object' && typeof obj !== 'function')
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj['default'] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var program = new commander.Command();

var run = function run(cmd, param) {
  var obj = {
    issue: _issue.exportSimgleIssue,
    // issues2md issue https://github.com/yanyue404/blog/issues/110
    toc: _toc.exportIssuesBlogToc,
    // issues2md toc https://github.com/yanyue404/blog
    articles: _articles.exportIssuesBlogArticles, // issues2md articles https://github.com/yanyue404/blog
  };
  obj[cmd] && obj[cmd](param);
};

program
  .version('0.0.2')
  .description('Export Github Issues (for bloggers) to markdown file')
  .name('issues2md')
  .usage('<issue || toc || articles>')
  .arguments('<cmd> [param]')
  .action(function(cmd, param) {
    run(cmd, param);
  });
program.parse(process.argv);
if (!program.args.length) program.help();
