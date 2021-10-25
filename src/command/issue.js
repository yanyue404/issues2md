const fs = require('fs');
import { formatMarkdown } from '../utils';
import { axios, cheerio, turndownService } from './index';
function getIssues(fetchUrl) {
  return axios
    .get(fetchUrl)
    .then(function(response) {
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
    .catch(err => {
      console.log(err);
    });
}
const exportSimgleIssue = issues_url => {
  getIssues(issues_url)
    .then(obj => {
      const dir = 'docs/';
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      fs.writeFile(`docs/${obj.title}.md`, formatMarkdown(obj.content), err => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    })
    .catch(err => {
      console.log(err);
    });
};
export { exportSimgleIssue };
