const fs = require('fs');
const axios = require('axios');
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
import { saveData_dev, createFile, addZero } from '../utils';
import { Api, Blog, Blogs } from '../type';

function getAPI(blogURL: string): Promise<any> {
  return new Promise(resolve => {
    axios.get(blogURL + '/issues').then(function(response: any) {
      let html_string: string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let obj: any = {};
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
      let urlList: string[] = [];
      for (let i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          config.github.blog + '/issues?page=' + i + ' is:issue is:open';
      }
      obj.fetchList = urlList;
      // 获取所有  Issues 数据,再返回
      _getAllPageIssues(urlList, (issues: Blogs[]) => {
        obj.blogs = issues;
        saveData_dev(obj, 'api.json', function() {
          resolve(obj);
        });
      });
    });
  }).catch(function(error: any) {
    console.log(error);
  });
}
function _getAllPageIssues(
  fetchUrlsArray: string[],
  callback: (r: Blogs[]) => void,
) {
  let result: any[] = [];
  Promise.all(
    fetchUrlsArray.map((url: string) => _getSimglePageIssuesMessage(url)),
  )
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
function _getSimglePageIssuesMessage(fetchUrl: string) {
  return axios
    .get(fetchUrl)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array: Blogs[] = [];
      $('.Box .Box-row').each(function() {
        // 像jQuery一样获取对应节点值
        let obj: any = {};
        obj.id = $(this)
          .attr('id')
          .slice(6);
        obj.title = $('#issue_' + obj.id + '_link')
          .text()
          .trimStart()
          .trimEnd();
        let labelText: string[] = [];
        $(this)
          .find('.IssueLabel')
          .each(function(i: any, elem: any) {
            labelText[i] = $(this).text();
          });
        obj.labels = labelText;
        obj.time = $(this)
          .find('.opened-by relative-time')
          .attr('datetime')
          .slice(0, 10);

        list_array.push(obj);
      });
      return list_array;
    })
    .catch((error: any) => {
      console.log(error);
    });
}

function exportAllMarkdown() {
  let SETING_FILE = 'docs/json/api.json';
  if (fs.existsSync(SETING_FILE)) {
    fs.readFile(SETING_FILE, 'utf8', function(err: any, data: any) {
      if (err) console.log(err);
      const issues = JSON.parse(data).blogs;
      // 导出
      issues.forEach((issue: Blog) => {
        _singleMarkdownFileExport(issue.time + '-' + issue.title, issue.id);
      });
    });
  } else {
    console.log('not find ' + SETING_FILE);
  }
}
function _singleMarkdownFileExport(name: string, issuesID: string) {
  let fileName: string = filenamify(name);
  const exportByYear = config.year;
  const fileDirectory = exportByYear
    ? 'docs/' + fileName.slice(0, 4) + '/'
    : 'docs/';
  let url: string = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接
  return axios
    .get(url)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      const content: string = turndownService.turndown($('table').html());
      createFile(fileDirectory, fileName + '.md', content);
    })
    .catch((error: any) =>
      console.log('Markdown - ' + addZero(issuesID, 3) + ' - ' + error),
    );
}

const exportIssuesBlogArticles = (blog_url: string) => {
  let promise = getAPI(blog_url); // 发起抓取
  promise.then((response: any) => {
    exportAllMarkdown();
  });
};

export { exportIssuesBlogArticles };
