const fs = require('fs');
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const filenamify = require('filenamify');
const markdown = require('markdown-js');
const app = express();
const config = require('../config/config.json');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

function getAPI() {
  return axios
    .get(config.github.blog + '/issues')
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
      let urlList: any[] = [];
      for (let i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          config.github.blog + '/issues?page=' + i + ' is:issue is:open';
      }
      obj.fetchList = urlList;
      // 获取所有  Issues 数据,再返回
      return new Promise(resolve => {
        getAllPageIssues(urlList, (issues: any) => {
          obj.blogs = issues;
          saveData(obj);
          resolve(obj);
        });
      });
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

function getAllPageIssues(fetchUrlsArray: any, callback: any) {
  let result: any[] = [];
  Promise.all(fetchUrlsArray.map((url: any) => getSimglePageIssuesMessage(url)))
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

function getSimglePageIssuesMessage(fetchUrl: any) {
  return axios
    .get(fetchUrl)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array: any[] = [];
      $('.Box .Box-row').each(function(dom: any) {
        // 像jQuery一样获取对应节点值
        let obj: any = {};
        obj.id = $(this)
          .attr('id')
          .slice(6);
        obj.title = $('#issue_' + obj.id + '_link')
          .text()
          .trimStart()
          .trimEnd();
        let labelText: any[] = [];
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
// // 数据保存 至 /data/api.json
function saveData(data: any) {
  const content = JSON.stringify(data);
  if (fs.existsSync('data/')) {
    fs.writeFile('data/' + 'api.json', content, (err: any) => {
      if (err) throw err;
      console.log('Api.json saved successful!');
    });
  }
}

function getHtml() {
  return axios
    .get(config.github.blog + '/issues')
    .then((response: any) => {
      return Promise.resolve(response.data.toString());
    })
    .catch((error: any) => {
      console.log(error);
    });
}
function exportAllMarkdown() {
  let file = 'data/api.json';
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', function(err: any, data: any) {
      if (err) console.log(err);
      const issues = JSON.parse(data).blogs;
      // 导出
      issues.forEach((issue: any, index: any, array: any) => {
        singleMarkdownFileExport(
          issue.time + '-' + issue.title,
          issue.id,
          array.length,
        );
      });
    });
  } else {
    console.log('not find' + file);
  }
}
// 单个 md 文件导出
function singleMarkdownFileExport(name: any, issuesID: any, totalCount: any) {
  let fileName = filenamify(name);
  const exportByYear = config.year;
  const fileDirectory = exportByYear
    ? config.folder + '/' + fileName.slice(0, 4) + '/'
    : config.folder + '/';
  let url = config.github.blog + '/issues/' + issuesID; // 拼接请求的页面链接
  const addZero = (num: any, length: any) => {
    return (Array(length).join('0') + num).slice(-length);
  };
  return axios
    .get(url)
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      const content = turndownService.turndown($('table').html());
      // 判断文件夹路径是否存在
      if (fs.existsSync(fileDirectory)) {
        fs.writeFile(fileDirectory + fileName + '.md', content, (err: any) => {
          if (err) throw err;
          console.log(
            'Markdown - ' +
              addZero(issuesID, 3) +
              ' - ' +
              fileName +
              ' export successful! ',
          );
        });
      } else {
        fs.mkdir(fileDirectory, { recursive: true }, (err: any) => {
          if (err) throw err;
          fs.writeFile(
            fileDirectory + fileName + '.md',
            content,
            (err: any) => {
              if (err) throw err;
              console.log(
                'Markdown - ' +
                  addZero(issuesID, 3) +
                  ' - ' +
                  fileName +
                  ' export successful! [mkdir]',
              );
            },
          );
        });
      }

      return Promise.resolve(content);
    })
    .catch((error: any) =>
      console.log(
        'Markdown - ' + addZero(issuesID, 3) + ' - ' + fileName + error,
      ),
    );
}
app.get('/', (req: any, res: any) => {
  let promise = getHtml();
  promise.then((html: any) => {
    res.send(html);
    res.end();
  });
});
app.get('/api', (req: any, res: any) => {
  let promise = getAPI(); // 发起抓取
  promise.then((response: any) => {
    //markdown.markHtml(); 是将markdown格式的字符转换成Html
    res.send(response);
    res.end();
  });
});
app.get('/export', (req: any, res: any) => {
  exportAllMarkdown();
  res.send();
  res.end();
});

app.listen(3000, () => console.log('Listening on http://localhost:3000!')); // 监听3000端口
