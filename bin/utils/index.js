'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.turndownService = exports.saveData_dev = exports.readData_dev = exports.prettierFormatMarkdown = exports.createFile = exports.addZero = void 0;

var fs = require('fs');

var prettier = require('prettier');

var TurndownService = require('turndown');

var turndownPluginGfm = require('turndown-plugin-gfm');

var formatOptions = require('../../.prettierrc.js'); // Convert HTML into Markdown with JavaScript.
// Usage: var markdown = turndownService.turndown('<h1>Hello world!</h1>')

var turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
}); // 使用 GitHub Flavored Markdown Spec https://github.github.com/gfm/#introduction

exports.turndownService = turndownService;
var gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

var prettierFormatMarkdown = function prettierFormatMarkdown(markdown) {
  return prettier.format(
    markdown,
    Object.assign(Object.assign({}, formatOptions), {
      parser: 'markdown',
    }),
  );
}; //  数据保存 至 db 文件夹

exports.prettierFormatMarkdown = prettierFormatMarkdown;

var saveData_dev = function saveData_dev(data, href, callback) {
  var content = JSON.stringify(data);
  var dir = 'db/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  fs.writeFile('db/' + href, content, function(err) {
    if (err) throw err;
    callback && callback();
    console.log(''.concat(href, ' saved successful!'));
  });
}; // 读取数据从 db 文件夹

exports.saveData_dev = saveData_dev;

var readData_dev = function readData_dev(href, callback) {
  var readFileURL = 'db/' + href;

  if (fs.existsSync(readFileURL)) {
    fs.readFile(readFileURL, 'utf8', function(err, data) {
      if (err) console.log(err);
      callback(data);
    });
  } else {
    console.log('not find ' + readFileURL);
  }
};

exports.readData_dev = readData_dev;

var addZero = function addZero(num, length) {
  return (Array(length).join('0') + num).slice(-length);
};

exports.addZero = addZero;

var createFile = function createFile(fileDirectory, fileName, content) {
  // 判断文件夹路径是否存在
  if (fs.existsSync(fileDirectory)) {
    fs.writeFile(fileDirectory + fileName, content, function(err) {
      if (err) throw err;
      console.log(fileName + ' export successful! ');
    });
  } else {
    fs.mkdir(
      fileDirectory,
      {
        recursive: true,
      },
      function(err) {
        if (err) throw err;
        fs.writeFile(fileDirectory + fileName + '.md', content, function(err) {
          if (err) throw err;
          console.log(fileName + ' export successful! [mkdir]');
        });
      },
    );
  }
};

exports.createFile = createFile;
