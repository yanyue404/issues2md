'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var axios = require('axios');

var prdConfig = require('../../project.config');

var githubToken = function githubToken(token) {
  return Buffer.from(token, 'base64').toString();
};

var token = githubToken(prdConfig.token);

var _default = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    // 'X-RateLimit-Limit': 5000,
    // 'X-RateLimit-Remaining': 4966,
    // 'X-RateLimit-Reset': 1372700873,
    Authorization: 'token '.concat(token),
  },
});

exports['default'] = _default;
