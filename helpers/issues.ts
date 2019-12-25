const prettier = require('prettier');
const formatOptions = require('../.prettierrc.js');
import { axios, cheerio, turndownService } from './index';

// 单个博客地址
let issues_url = 'https://github.com/yanyue404/blog/issues/110';

// 命令行传参支持
const npm_argv = JSON.parse(process.env.npm_config_argv);
if (!(npm_argv && npm_argv.original instanceof Array)) {
  throw TypeError('npm argv Error'); // 异常的抛出会终止log:issues命令
}
if (npm_argv.original[0] === `log:issues`) {
  if (npm_argv.original[1].indexOf('https://github.com/') !== -1) {
    // 使用命令行传过来的issues 地址链接参数
    issues_url = npm_argv.original[1];
  } else {
    throw TypeError(
      'npm argv Error,请输入一个合理的 GitHub issues 地址，比如: https://github.com/yanyue404/blog/issues/111',
    );
  }
}

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
