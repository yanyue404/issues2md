const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const filenamify = require('filenamify');
const markdown = require('markdown-js');
const app = express();
const config = require('./config.json');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});
var gfm = turndownPluginGfm.gfm;

// turndownService.addRule('PreCode', {
//   filter: ['pre'],
//   replacement: function(content, node) {
//     var className = node.parentNode.getAttribute('class') || '';
//     var language = className.split('-')[2];
//     console.log(language);

//     return '\n```' + language + '\n' + content + '\n```\n';
//   },
// });
turndownService.use(gfm);

function getData() {
  return axios
    .get(config.github.blog + '/issues')
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array = [];
      $('.Box .Box-row').each(function(dom) {
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
            labelText[i] = $(this).text();
          });
        obj.labels = labelText;
        obj.time = $(this)
          .find('.opened-by relative-time')
          .attr('datetime')
          .slice(0, 10);

        list_array.push(obj);
      });

      return Promise.resolve(list_array);
      //  html 调试用
      // return Promise.resolve(html_string);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function createSingleMarkdown(name, issuesID) {
  var fileDirectory = 'test/';
  let url = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接
  let fileName = filenamify(name);
  // articles/2019/2019-01-02-站在未来的十字路口.md
  return axios
    .get(url)
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      // console.log($("table").html());
      var content = turndownService.turndown($('table').html());
      // console.log(content);
      // 判断文件夹路径是否存在
      if (fs.existsSync(fileDirectory)) {
        fs.writeFile('./test/' + fileName + '.md', content, err => {
          if (err) throw err;
          console.log('Markdown - ' + fileName + ' export successful!');
        });
      } else {
        console.log(fileDirectory + '  Not Found!');
      }

      return Promise.resolve(content);
    })
    .catch(function(error) {
      console.log(fileName + error);
    });
}

app.get('/', (req, res) => {
  let promise = getData(); // 发起抓取
  promise.then(response => {
    //markdown.markHtml(); 是将markdown格式的字符转换成Html
    response.forEach(issue => {
      createSingleMarkdown(issue.time + '-' + issue.title, issue.id);
    });

    res.send(response);
    res.end();
  });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000!')); // 监听3000端口
