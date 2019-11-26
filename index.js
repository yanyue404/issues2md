const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const TurndownService = require('turndown');
const markdown = require('markdown-js');
const app = express();
const config = require('./config.json');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

turndownService.addRule('PreCode', {
  filter: ['pre'],
  replacement: function(content, node) {
    return '\n```\n' + content + '\n```\n';
  },
});

function getData(time, language) {
  var fileDirectory = 'test/';
  let url = config.github.blog + '/issues/1'; // 拼接请求的页面链接
  return axios
    .get(url)
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      // console.log($("table").html());
      var content = turndownService.turndown($('table').html());
      console.log(content);
      // 判断文件夹路径是否存在
      if (fs.existsSync(fileDirectory)) {
        fs.writeFile('./test/git入门与实践.md', content, err => {
          if (err) throw err;
          console.log("It's saved!");
        });
      } else {
        console.log(fileDirectory + '  Not Found!');
      }

      return Promise.resolve(content);
    })
    .catch(function(error) {
      console.log(error);
    });
}

app.get('/', (req, res) => {
  let promise = getData('daily'); // 发起抓取
  promise.then(response => {
    //markdown.markHtml(); 是将markdown格式的字符转换成Html
    var html = markdown.makeHtml(response);
    res.send(html);
    res.end();
  });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000!')); // 监听3000端口
