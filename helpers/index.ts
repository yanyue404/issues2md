export const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
import { githubToken } from '../src/utils/index';
const config = require('../config/config.json');
export const axios = require('axios');
export const cheerio = require('cheerio');
export const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

let token = githubToken(config.github.token);

export const $axios = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    // 'X-RateLimit-Limit': 5000,
    // 'X-RateLimit-Remaining': 4966,
    // 'X-RateLimit-Reset': 1372700873,
    Authorization: `token ${token}`,
  },
});
