'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.saveData_dev = exports.githubToken = exports.formatMarkdown = exports.fetch = exports.createFile = exports.addZero = void 0;

var fs = require('fs');

var request = require('request');

var prettier = require('prettier');

var formatOptions = require('../../.prettierrc.js');

var prdConfig = require('../../project.config'); //  数据保存 至 data 文件夹

var saveData_dev = function saveData_dev(data, href, callback) {
  var content = JSON.stringify(data);
  var dir = 'docs/json/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  fs.writeFile('docs/json/' + href, content, function(err) {
    if (err) throw err;
    callback && callback();
    console.log(''.concat(href, ' saved successful!'));
  });
};

exports.saveData_dev = saveData_dev;

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

var formatMarkdown = function formatMarkdown(markdown) {
  return prettier.format(
    markdown,
    Object.assign(Object.assign({}, formatOptions), {
      parser: 'markdown',
    }),
  );
};

exports.formatMarkdown = formatMarkdown;

var githubToken = function githubToken(token) {
  return Buffer.from(token, 'base64').toString();
}; // 如何 api 请求墙外网址 https://cnodejs.org/topic/5af24e62adea947348e761ec
// https://www.npmjs.com/package/request

exports.githubToken = githubToken;

var fetch = function fetch(url) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = {
    uri: url,
    method: 'GET',
    timeout: 30, // 30s 连接超时
  };
  prdConfig.PROXY &&
    Object.assign(options, {
      proxy: prdConfig.PROXY,
    });
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

      if (!err) {
        resolve(body);
      } else {
        reject(err);
        console.error('error:', error); // Print the error if one occurred
      }
    });
  });
};

exports.fetch = fetch;
