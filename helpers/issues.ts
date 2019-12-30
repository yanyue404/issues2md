import { formatMarkdown, check_npm_argv } from '../src/utils';
import { axios, cheerio, turndownService } from './index';

// 单个博客地址
let issues_url = 'https://github.com/yanyue404/blog/issues/110';

// 命令行传参校验
check_npm_argv(
  'log:issues',
  issues_url,
  'npm argv Error,请输入一个合理的 GitHub issues 地址，比如: https://github.com/yanyue404/blog/issues/111',
);

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
    console.log(formatMarkdown(markdown));
  })
  .catch((err: any) => {
    console.log(err);
  });
