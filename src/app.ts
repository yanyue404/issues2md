#!/usr/bin/env ts-node
import * as commander from 'commander';
import { exportIssuesBlogToc } from './command/toc';
import { exportSimgleIssue } from './command/issue';
import { exportGithubUserStared } from './command/stars';
import { exportGithubUserFolling } from './command/following';
import { exportIssuesBlogArticles } from './command/articles';

const program = new commander.Command();

const run = (cmd: string, param: string) => {
  const obj: any = {
    issue: exportSimgleIssue, // github-to-md issue https://github.com/yanyue404/blog/issues/110
    toc: exportIssuesBlogToc, // github-to-md toc https://github.com/yanyue404/blog
    star: exportGithubUserStared, // github-to-md star yanyue404
    follow: exportGithubUserFolling, // github-to-md follow yanyue404
    articles: exportIssuesBlogArticles, // github-to-md articles https://github.com/yanyue404/blog
  };
  obj[cmd] && obj[cmd](param);
};

program
  .version('1.0.0')
  .description('Export Github (Issues, Stars, Following) to markdown file')
  .name('github-to-md')
  .usage('<issue || toc || star || follow || articles>')
  .arguments('<cmd> [param]')
  .action(function(cmd, param) {
    run(cmd, param);
  });

program.parse(process.argv);

if (!program.args.length) program.help();
