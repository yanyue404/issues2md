#!/usr/bin/env node

// https://stackoverflow.com/questions/35387264/node-js-request-module-getting-etimedout-and-esockettimedout
process.env.UV_THREADPOOL_SIZE = 128;

import * as commander from 'commander';
import { exportIssuesBlogToc } from './command/toc';
import { exportSimgleIssue } from './command/issue';
import { exportIssuesBlogArticles } from './command/articles';

const program = new commander.Command();

const run = (cmd, param) => {
  const obj = {
    issue: exportSimgleIssue, // issues2md issue https://github.com/yanyue404/blog/issues/110
    toc: exportIssuesBlogToc, // issues2md toc https://github.com/yanyue404/blog
    articles: exportIssuesBlogArticles, // issues2md articles https://github.com/yanyue404/blog
  };

  if (['issue', 'toc', 'articles'].includes(cmd)) {
    if (param && /https:\/\/github.com\/*/.test(param)) {
      obj[cmd](param);
    } else {
      console.error('[' + param + ']' + ' link address is not standardized!');
    }
  } else {
    console.error('[' + cmd + ']' + ' cmmand not Support!');
  }
};

program
  .version('0.0.5')
  .description('Export Github Issues (for bloggers) to markdown file')
  .name('issues2md')
  .usage('<issue || toc || articles>')
  .arguments('<cmd> [param]')
  .action(function(cmd, param) {
    run(cmd, param);
  });

program.parse(process.argv);

if (!program.args.length) program.help();
