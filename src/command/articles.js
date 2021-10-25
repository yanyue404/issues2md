const fs = require('fs');
const cheerio = require('cheerio');
const filenamify = require('filenamify');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const config = require('../../config/config.json');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);
import { saveData_dev, createFile, addZero, fetch } from '../utils';

function getAPI(blogURL) {
  return new Promise(resolve => {
    fetch(blogURL + '/issues').then(function(html_string) {
      const $ = cheerio.load(html_string); // 传入页面内容
      let obj = {};
      const totalPage = $('.pagination')
        .find('.current')
        .data('total-pages');
      obj.totalPage = Number(totalPage);
      const numbers = $('.states a')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd()
        .split(' ')[0];
      obj.numbers = Number(numbers);
      let urlList = [];
      for (let i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          config.github.blog + '/issues?page=' + i + ' is:issue is:open';
      }
      obj.fetchList = urlList;
      // 获取所有  Issues 数据,再返回
      _getAllPageIssues(urlList, issues => {
        obj.blogs = issues;
        saveData_dev(obj, 'api.json', function() {
          resolve(obj);
        });
      });
    });
  }).catch(function(error) {
    console.log(error);
  });
}
function _getAllPageIssues(fetchUrlsArray, callback) {
  let result = [];
  Promise.all(fetchUrlsArray.map(url => _getSimglePageIssuesMessage(url)))
    .then(res => {
      for (var i = 0; i < res.length; i++) {
        result = result.concat(res[i]);
      }
      result.sort((x, y) => {
        return Number(y.id) - Number(x.id);
      });
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
}
function _getSimglePageIssuesMessage(fetchUrl) {
  return fetch(fetchUrl)
    .then(function(html_string) {
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array = [];
      $('.Box .Box-row').each(function() {
        // 像jQuery一样获取对应节点值
        let obj = {};
        obj.id = $(this)
          .attr('id')
          .slice(6);
        obj.title = $('#issue_' + obj.id + '_link')
          .text()
          .trimStart()
          .trimEnd();
        let labelText = [];
        $(this)
          .find('.IssueLabel')
          .each(function(i, elem) {
            labelText[i] = $(this)
              .text()
              .trimStart()
              .trimEnd();
          });
        obj.labels = labelText;
        obj.time = $(this)
          .find('relative-time')
          .attr('datetime')
          .slice(0, 10);
        list_array.push(obj);
      });
      return list_array;
    })
    .catch(error => {
      console.log(error);
    });
}
function exportAllMarkdown() {
  let SETING_FILE = 'docs/json/api.json';
  if (fs.existsSync(SETING_FILE)) {
    fs.readFile(SETING_FILE, 'utf8', function(err, data) {
      if (err) console.log(err);
      const issues = JSON.parse(data).blogs;
      // 导出
      issues.forEach(issue => {
        if (issue && issue.time && issue.title && issue.id) {
          _singleMarkdownFileExport(issue.time + '-' + issue.title, issue.id);
        } else {
          console.log('导出出问题:', { issue });
        }
      });
    });
  } else {
    console.log('not find ' + SETING_FILE);
  }
}
function _singleMarkdownFileExport(name, issuesID) {
  let fileName = filenamify(name);
  const exportByYear = config.year;
  const fileDirectory = exportByYear
    ? 'docs/' + fileName.slice(0, 4) + '/'
    : 'docs/';
  let url = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接
  return fetch(url)
    .then(function(html_string) {
      const $ = cheerio.load(html_string); // 传入页面内容
      const content = turndownService.turndown($('table').html());
      createFile(fileDirectory, fileName + '.md', content);
    })
    .catch(error =>
      console.log('Markdown - ' + addZero(issuesID, 3) + ' - ' + error),
    );
}
const exportIssuesBlogArticles = blog_url => {
  let promise = getAPI(blog_url); // 发起抓取
  promise.then(response => {
    console.log('kaishi -----');
    exportAllMarkdown();
  });
};
export { exportIssuesBlogArticles };
