#!/usr/bin/env ts-node
import * as commander from 'commander';
import { exportIssuesBlogToc } from './command/toc';
import { exportSimgleIssue } from './command/issue';
import { exportGithubUserStared } from './command/stars';
import { exportGithubUserFolling } from './command/following';
import { exportIssuesBlogArticles } from './command/articles';

const program = new commander.Command();

program
  .version('0.7.0')
  .name('export')
  .usage('<issue || issues || doc || stars || stars || follow || articles>')
  .arguments('<cmd> [detail]')
  .action(function(cmd, detail) {
    // test: yarn dev issue https://github.com/yanyue404/blog/issues/110
    if (cmd === 'issue') {
      // issues_url 'https://github.com/yanyue404/blog/issues/110';
      exportSimgleIssue(detail);
      // test: yarn dev doc https://github.com/yanyue404/blog
    } else if (cmd === 'toc') {
      // blog_url 'https://github.com/yanyue404/blog'
      exportIssuesBlogToc(detail);
    } else if (cmd === 'star') {
      exportGithubUserStared(detail);
    } else if (cmd === 'flow') {
      exportGithubUserFolling(detail);
    } else if (cmd === 'articles') {
      exportIssuesBlogArticles(detail);
    }
  });
program.parse(process.argv);
