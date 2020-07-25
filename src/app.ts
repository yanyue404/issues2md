#!/usr/bin/env ts-node
import * as commander from 'commander';
import issuesExport from './issues';
import { issuesLog } from './helpers/issue';

const program = new commander.Command();

program
  .version('0.0.2')
  .name('export')
  .usage('<issue || issues || doc || stars || stars || follow || articles>')
  .arguments('<issue || issues || doc || stars || stars || follow || articles>')
  .action(function(cmd) {
    console.log(cmd);
    if (cmd === 'issue') {
      issuesLog('https://github.com/yanyue404/blog/issues/110');
    }
  });
program.parse(process.argv);
