'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.turndownService = exports.cheerio = exports.axios = exports.TurndownService = exports.$axios = void 0;

var _index = require('../utils/index');

var TurndownService = require('turndown');

exports.TurndownService = TurndownService;

var turndownPluginGfm = require('turndown-plugin-gfm');

var config = require('../../config/config.json');

var axios = require('axios');

exports.axios = axios;

var cheerio = require('cheerio');

exports.cheerio = cheerio;
var turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});
exports.turndownService = turndownService;
var gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);
var token = (0, _index.githubToken)(config.github.token);
var $axios = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    // 'X-RateLimit-Limit': 5000,
    // 'X-RateLimit-Remaining': 4966,
    // 'X-RateLimit-Reset': 1372700873,
    Authorization: 'token '.concat(token),
  },
});
exports.$axios = $axios;
