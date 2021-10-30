const fs = require('fs');
const cheerio = require('cheerio');
import { _get } from '../http';
import { prettierFormatMarkdown, turndownService } from '../utils';

function getIssues(fetchUrl) {
  return _get(fetchUrl)
    .then(function(response) {
      const $ = cheerio.load(response); // 传入页面内容
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
      fs.writeFile(
        `docs/${obj.title}.md`,
        prettierFormatMarkdown(obj.content),
        err => {
          if (err) throw err;
          console.log('The file has been saved!');
        },
      );
    })
    .catch(err => {
      console.log(err);
    });
};
export { exportSimgleIssue };
