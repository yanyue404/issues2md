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
turndownService.use(gfm);

function getData() {
  return axios
    .get(config.github.blog + '/issues')
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let blogs = {};
      const totalPage = $('.pagination')
        .find('a')
        .eq(-2)
        .text();
      blogs.totalPage = Number(totalPage);
      const numbers = $('.states a')
        .eq(0)
        .text()
        .trimStart()
        .trimEnd()
        .split(' ')[0];
      blogs.numbers = Number(numbers);
      let urlList = [];
      for (i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          config.github.blog + '/issues?page=' + i + ' is:issue is:open';
      }
      blogs.fetchList = urlList;

      getAllPageIssues(urlList, allIssuesList => {
        blogs.list = allIssuesList;
      });

      return Promise.resolve(blogs);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getHtml() {
  return axios
    .get(config.github.blog + '/issues')
    .then(response => {
      return Promise.resolve(response.data.toString());
    })
    .catch(error => {
      console.log(error);
    });
}

function getAllPageIssues(fetchUrlsArray, callback) {
  let result = [];
  axios.all(fetchUrlsArray.map(url => getSimglePageIssuesMessage(url))).then(
    axios.spread(function(...res) {
      for (var i = 0; i < res.length; i++) {
        result = result.concat(res[i]);
      }
      result.sort((x, y) => {
        return Number(y.id) - Number(x.id);
      });
      callback(result);
      // 导出
      result.forEach(({ time, title, id }) => {
        singleMarkdownFileExport(time + '-' + title, id);
      });
    }),
  );
}

function getSimglePageIssuesMessage(fetchUrl) {
  return axios
    .get(fetchUrl)
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
      return list_array;
    })
    .catch(error => {
      console.log(error);
    });
}
// 单个 md 文件导出
function singleMarkdownFileExport(name, issuesID) {
  let fileName = filenamify(name);
  const exportByYear = config.year;
  const fileDirectory = exportByYear
    ? config.folder + '/' + fileName.slice(0, 4) + '/'
    : config.folder + '/';
  let url = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接
  const addZero = (num, length) => {
    //这里用slice和substr均可
    return (Array(length).join('0') + num).slice(-length);
  };
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
        if (!exportByYear) {
          fs.writeFile(fileDirectory + fileName + '.md', content, err => {
            if (err) throw err;
            console.log(
              'Markdown - ' +
                addZero(issuesID, 3) +
                ' - ' +
                fileName +
                ' export successful!',
            );
          });
        }
      } else {
        fs.mkdir(fileDirectory, { recursive: true }, err => {
          if (err) throw err;
          fs.writeFile(fileDirectory + fileName + '.md', content, err => {
            if (err) throw err;
            console.log(
              'Markdown - ' +
                addZero(issuesID, 3) +
                ' - ' +
                fileName +
                ' export successful!',
            );
          });
        });
      }

      return Promise.resolve(content);
    })
    .catch(function(error) {
      console.log(
        'Markdown - ' + addZero(issuesID, 3) + ' - ' + fileName + error,
      );
    });
}

app.get('/', (req, res) => {
  let promise = getData(); // 发起抓取
  promise.then(response => {
    //markdown.markHtml(); 是将markdown格式的字符转换成Html
    res.send(response);
    res.end();
  });
});
app.get('/html', (req, res) => {
  let promise = getHtml();
  promise.then(html => {
    res.send(html);
    res.end();
  });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000!')); // 监听3000端口
