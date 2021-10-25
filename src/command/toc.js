const fs = require('fs');
import { axios, turndownService } from './index';
import { formatMarkdown } from '../utils';

process.on('uncaughtException', function(err) {
  console.log(err.stack);
  console.log('NOT exit...');
});

process.once('SIGUSR2', function() {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function() {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

// 接口文档 https://docs.github.com/cn/rest/reference/issues
// https://api.github.com/repos/yanyue404/blog/issues?state=open&page=1&per_page=100

// 配置代理服务器信息

let db_issues = {};

// https://github.com/yanyue404/blog
async function getAllPageIssuesInfo(blogRequestURL) {
  if (blogRequestURL && blogRequestURL.split('https://github.com/')[1]) {
    const queryKeywords = blogRequestURL.split('https://github.com/')[1];
    let pageNo = 1;

    db_issues.baseURL = blogRequestURL;
    db_issues.queryKeywords = queryKeywords;
    db_issues.blogsOrigin = [];

    let createSingleRequestURL = pageNo =>
      `https://api.github.com/repos/${queryKeywords}/issues?state=open&page=${pageNo}&per_page=100`;

    const loopRequest = callback => {
      axios.get(createSingleRequestURL(pageNo)).then(resp => {
        if (resp.status == 200 && resp.data.length > 0) {
          console.log(
            `请求得到第 ${pageNo} 页结果，`,
            '共有' + resp.data.length + '条数据。',
          );

          db_issues.blogsOrigin = db_issues.blogsOrigin.concat(resp.data);

          // 下一页
          if (resp.data.length == 100) {
            pageNo++;
            setTimeout(() => {
              loopRequest(callback);
            }, 1500);
          }

          if (resp.data.length > 0 && resp.data.length < 100) {
            console.log(
              '结果出来了',
              '共有' + db_issues.blogsOrigin.length + '条',
            );
            callback(db_issues);
          }
        } else {
          console.log('Error: 没有数据或请求出错！');
        }
      });
    };
    return new Promise(function(resolve, reject) {
      loopRequest(result => {
        console.log('Get loopRequest result ---------------');
        resolve(result);
      });
    });
  } else {
    throw new Error('请求地址有误，请校验！');
  }
}

const IssuesInfoToToc = result => {
  let labelsArr = [];
  let articles = {};
  result.blogs.forEach(v => {
    let label = v.labels[0];
    if (!labelsArr.includes(label)) {
      labelsArr.push(label);
      articles[label] = [];
      articles[label].push(`[${v.title}](${v.url})`);
    } else {
      articles[label].push(`[${v.title}](${v.url})`);
    }
  });
  // '-[npm&yarn](https://github.com/yanyue404/blog/issues/7)[开发者笔记]'
  const header = '<h1>TOC</h1><br>';
  let sort = `<h2>分类</h2><br>`;
  sort += `<ul>`;
  labelsArr.forEach(category => {
    sort += `<li><a href="#${category}"><strong>${category}</strong></a></li>`;
  });
  sort += `</ul><br>`;
  let content = `<h2>文章</h2><br>`;
  for (let key in articles) {
    content += `<h3>${key}</h3><br>`;
    content += `<ul>`;
    articles[key].forEach((m, index, arr) => {
      content += `<li href="${m}">${m}</li>`;
      if (index === arr.length - 1) {
        content += `<br>`;
      }
    });
    content += `</ul>`;
  }
  let markdown = turndownService.turndown(
    '<body>' + header + sort + content + '</body>',
  );
  const dir = 'docs/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  const TocContent = formatMarkdown(markdown).replace(/\\/g, '');
  fs.writeFile(`docs/Toc.md`, TocContent, err => {
    if (err) throw err;
    console.log('The file has been saved!');
    db_issues = {};
  });
};

const exportIssuesBlogToc = async fetch_url => {
  const result = await getAllPageIssuesInfo(fetch_url);
  result.blogs = result.blogsOrigin.map(o => {
    return {
      title: o.title,
      url: o.html_url,
      labels: o.labels.map(item => item.name),
    };
  });
  IssuesInfoToToc(result);
};

export { exportIssuesBlogToc };
