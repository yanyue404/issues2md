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
