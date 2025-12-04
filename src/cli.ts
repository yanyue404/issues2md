#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { exportIssue } from './commands/issue';
import { exportToc } from './commands/toc';
import { exportArticles } from './commands/articles';

const program = new Command();

program
  .name('issues2md')
  .description('Export Github Issues (for bloggers) to markdown file')
  .version('1.0.0');

program
  .command('issue')
  .description('Export single issue as Markdown')
  .argument('<issue_url>', 'GitHub issue URL')
  .option('-o, --output <dir>', '输出目录', './output')
  .option('-t, --token <token>', 'GitHub access token')
  .action(async (issueUrl: string, options) => {
    try {
      await exportIssue(issueUrl, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

program
  .command('toc')
  .description('Export Github Blog issues list as Markdown')
  .argument('<blog_url>', 'GitHub repository URL')
  .option('-o, --output <dir>', '输出目录', './output')
  .option('-t, --token <token>', 'GitHub access token')
  .action(async (blogUrl: string, options) => {
    try {
      await exportToc(blogUrl, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

program
  .command('articles')
  .description('Export Github Blog issues as Markdown')
  .argument('<blog_url>', 'GitHub repository URL')
  .option('-o, --output <dir>', '输出目录', './output')
  .option('-t, --token <token>', 'GitHub access token')
  .action(async (blogUrl: string, options) => {
    try {
      await exportArticles(blogUrl, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    chalk.red('未处理的Promise拒绝:'),
    promise,
    chalk.red('原因:'),
    reason,
  );
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('未捕获的异常:'), error);
  process.exit(1);
});

program.parse();
