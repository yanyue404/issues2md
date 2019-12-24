const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const axios = require('axios');
const cheerio = require('cheerio');
const prettier = require('prettier');
const formatOptions = require('../../.prettierrc.js');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

// 单个博客地址
const issues_url = 'https://github.com/yanyue404/blog/issues/110';

function getIssues(fetchUrl: string) {
  return axios
    .get(fetchUrl)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      const content = turndownService.turndown($('table').html());
      return content;
    })
    .catch((err: any) => {
      console.log(err);
    });
}

getIssues(issues_url)
  .then((markdown: string) => {
    console.log(
      prettier.format(markdown, { ...formatOptions, parser: 'markdown' }),
    );
  })
  .catch((err: any) => {
    console.log(err);
  });
