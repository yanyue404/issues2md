const express = require('express');
const args = require('minimist')(process.argv.slice(2));
import { exportIssuesBlogToc } from './command/toc';
import { exportSimgleIssue } from './command/issue';
import { exportIssuesBlogArticles } from './command/articles';

const app = express();
const port = 3000;

// 命令与对应处理函数的映射
const commandHandlers = {
  toc: exportIssuesBlogToc,
  issue: exportSimgleIssue,
  articles: exportIssuesBlogArticles,
};

const [cmdValue, link] = args._;

// 启动 Express 服务
app
  .get('/', (req, res) => res.send('Hello World, issues2md！'))
  .listen(port, () =>
    console.log(`issues2md app listening at http://localhost:${port}`),
  );

// 验证链接并执行对应的命令
function executeCommand(cmd, url) {
  if (!validateLink(url)) return;
  const handler = commandHandlers[cmd];
  if (handler) {
    handler(url);
  } else {
    console.log(
      '请输入正确的命令, 例如 npm run dev toc https://github.com/yanyue404/blog',
    );
  }
}

// 链接验证
function validateLink(link) {
  if (!link.startsWith('https://github.com/')) {
    console.log('请输入正确的链接地址, 例如 https://github.com/yanyue404/blog');
    return false;
  }
  console.log('链接地址有效:', link);
  return true;
}

// 执行命令
executeCommand(cmdValue, link);
