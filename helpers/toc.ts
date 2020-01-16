const fs = require('fs');
import { axios, cheerio } from './index';
import { formatMarkdown } from '../src/utils';
const config = require('../config/config.json');
import { Api } from '../src/type';

// 博客主页地址
let blog_url = config.github.blog;

function getAPI(url: any) {
  return axios
    .get(url + '/issues')
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let obj: any = {};
      const totalPage = $('.pagination')
        .find('a')
        .eq(-2)
        .text();
      obj.totalPage = Number(totalPage);
      const numbers = $('.states a')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd()
        .split(' ')[0];
      obj.numbers = Number(numbers);
      let urlList: any = [];
      for (let i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          url + '/issues?page=' + i + ' is:issue is:open';
      }
      obj.fetchList = urlList;
      // 获取所有  Issues 数据,再返回
      return new Promise(resolve => {
        getAllPageIssues(urlList, (issues: any) => {
          obj.blogs = issues;
          resolve(obj);
        });
      });
    })
    .catch(function(error: any) {
      console.log(error);
    });
}
function getAllPageIssues(fetchUrlsArray: any, callback: any) {
  let result: any = [];
  Promise.all(
    fetchUrlsArray.map((url: string) => getSimglePageIssuesMessage(url)),
  )
    .then(res => {
      for (var i = 0; i < res.length; i++) {
        result = result.concat(res[i]);
      }
      result.sort((x: any, y: any) => {
        return Number(y.id) - Number(x.id);
      });
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
}

function getSimglePageIssuesMessage(fetchUrl: string) {
  return axios
    .get(fetchUrl)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array: any = [];
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
        let labelText: any = [];
        $(this)
          .find('.IssueLabel')
          .each(function(i: any) {
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

getAPI(blog_url).then((html: Api) => {
  let labelsArr: any[] = [];
  let articles: any = {};
  html.blogs.forEach(v => {
    let label = v.labels[0];
    if (!labelsArr.includes(label)) {
      labelsArr.push(label);
      articles[label] = [];
      articles[label].push(`[${v.title}](${blog_url}/issues/${v.id})`);
    } else {
      articles[label].push(`[${v.title}](${blog_url}/issues/${v.id})`);
    }
  });
  // '-[npm&yarn](https://github.com/yanyue404/blog/issues/7)[开发者笔记]'
  const header = `# TOC

  `;
  let sort = `## 分类

  `;
  labelsArr.forEach(l => {
    sort += `- [**${l}**](#${l})
  `;
  });
  let content = `## 文章

  `;
  for (let key in articles) {
    content += `### ${key}

  `;

    articles[key].forEach((m: any) => {
      content += `- ${m}
  `;
    });
  }
  let markdown: string = header + sort + content;
  fs.writeFile(`toc/README.md`, formatMarkdown(markdown), (err: any) => {
    console.log(err);
  });
});
