export const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
export const axios = require('axios');
export const cheerio = require('cheerio');
export const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

let token = 'NzJkZjE4NDJiYWI3OGE5N2UyNWM4ODYwOWVlNjFlOTE1YTUwOTYyZA==';
export const $axios = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    // 'X-RateLimit-Limit': 5000,
    // 'X-RateLimit-Remaining': 4966,
    // 'X-RateLimit-Reset': 1372700873,
    Authorization: `token 72df1842bab78a97e25c88609ee61e915a50962d`,
  },
});
