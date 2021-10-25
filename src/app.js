const express = require('express');
import { exportIssuesBlogToc } from './command/toc';
import { exportSimgleIssue } from './command/issue';
import { exportIssuesBlogArticles } from './command/articles';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! issues2md！');
});

app.get('/toc', (req, res) => {
  exportIssuesBlogToc('https://github.com/yanyue404/blog');
  res.send('Hello World!');
});

app.get('/issue', (req, res) => {
  exportSimgleIssue('https://github.com/yanyue404/blog/issues/221');
  res.send('Hello World!');
});

app.get('/articles', (req, res) => {
  exportIssuesBlogArticles('https://github.com/yanyue404/blog');
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
