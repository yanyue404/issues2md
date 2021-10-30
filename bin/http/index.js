'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports._get = void 0;

var request = require('request');

var prdConfig = require('../../project.config'); // 适用于爬取 html 地址，axios 适用于 get 等请求
// 如何 api 请求墙外网址 https://cnodejs.org/topic/5af24e62adea947348e761ec
// https://www.npmjs.com/package/request

var _get = function _get(url) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = {
    url: url,
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': 'axios/0.18.0',
    },
    timeout: 30, // 30s 连接超时
  };
  prdConfig.PROXY &&
    Object.assign(options, {
      proxy: prdConfig.PROXY,
    });
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (response && response.statusCode != 200) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      }

      if (!error) {
        resolve(body);
      } else {
        reject(error);
        console.error('[_get error]:', error); // Print the error if one occurred
      }
    });
  });
};

exports._get = _get;
