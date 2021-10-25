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
  obj[cmd] && obj[cmd](param);
};

program
  .version('0.0.1')
  .description('Export Github Issues (for bloggers) to markdown file')
  .name('issues2md')
  .usage('<issue || toc || articles>')
  .arguments('<cmd> [param]')
  .action(function(cmd, param) {
    run(cmd, param);
  });

program.parse(process.argv);

if (!program.args.length) program.help();
