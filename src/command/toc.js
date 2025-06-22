const fs = require('fs');
const axios = require('axios');
import { prettierFormatMarkdown, turndownService, formatTime } from '../utils';

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

let blogName = 'Toc';

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
            '得到 ' + resp.data.length + ' 条数据。',
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
  // 生成年月角标的辅助函数 - 文章目录使用彩色角标
  const generateDateBadge = createdAt => {
    const createDate = new Date(createdAt);
    const year = createDate.getFullYear();
    const month = (createDate.getMonth() + 1).toString().padStart(2, '0');
    return `<span style="background: #e1f5fe; color: #0277bd; padding: 2px 6px; border-radius: 10px; font-size: 0.8em;">${year}-${month}</span>`;
  };

  let labelsArr = [];
  let articles = {};
  result.blogs.forEach(v => {
    let label = v.labels[0];
    const dateBadge = generateDateBadge(v.created_at);

    if (!labelsArr.includes(label)) {
      labelsArr.push(label);
      articles[label] = [];
      articles[label].push(`[${v.title}](${v.url}) ${dateBadge}`);
    } else {
      articles[label].push(`[${v.title}](${v.url}) ${dateBadge}`);
    }
  });
  // '-[npm&yarn](https://github.com/yanyue404/blog/issues/7)[开发者笔记]'
  const header = '<h2>目录</h2><br>';
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
      content += `<li>${m}</li>`;
      if (index === arr.length - 1) {
        content += `<br>`;
      }
    });
    content += `</ul>`;
  }
  let detailsStart = `<details open>
  <summary>Update time: ${formatTime(
    new Date(),
    'YYYY-MM-DD',
  )} by <a href="https://github.com/yanyue404/issues2md">issues2md</a> :sunflower:</summary>`;

  let detailsEnd = ` </details>`;

  let markdown = turndownService.turndown(
    '<body>' + header + detailsStart + sort + content + detailsEnd + '</body>',
  );

  const dir = 'docs/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  const TocContent = prettierFormatMarkdown(markdown).replace(/\\/g, '');
  fs.writeFile(`docs/${blogName}.md`, TocContent, err => {
    if (err) throw err;
    console.log('The file has been saved!');
    db_issues = {};
  });
};

const exportIssuesBlogToc = async fetch_url => {
  if (!fetch_url) {
    throw new Error('请输入正确的地址！');
  }

  blogName = fetch_url.split('https://github.com/')[1].replace('/', '@');
  const result = await getAllPageIssuesInfo(fetch_url);
  result.blogs = result.blogsOrigin.map(o => {
    return {
      title: o.title,
      url: o.html_url,
      labels: o.labels.map(item => item.name),
      created_at: o.created_at,
    };
  });
  IssuesInfoToToc(result);
};

export { exportIssuesBlogToc };
