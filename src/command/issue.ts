const fs = require('fs');
import { formatMarkdown } from '../utils';
import { axios, cheerio, turndownService } from './index';

// 单个博客地址

interface blog {
  title: string;
  content: string;
}

interface Res {
  data: any;
}

function getIssues(fetchUrl: string) {
  return axios
    .get(fetchUrl)
    .then(function(response: Res) {
      debugger;
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      const title = $('.js-issue-title')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd();
      const content = turndownService.turndown($('table').html());
      return { title, content };
    })
    .catch((err: any) => {
      console.log(err);
    });
}

const exportSimgleIssue = (issues_url: string) => {
  getIssues(issues_url)
    .then((obj: blog) => {
      const dir = 'docs/';
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      fs.writeFile(
        `docs/${obj.title}.md`,
        formatMarkdown(obj.content),
        (err: any) => {
          console.log(err);
        },
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export { exportSimgleIssue };
