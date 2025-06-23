import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import { GitHubClient } from '../utils/github';
import { MarkdownConverter } from '../utils/markdown';
import { CLIOptions } from '../types';

export async function exportArticles(
  blogUrl: string,
  options: CLIOptions = {},
): Promise<void> {
  const spinner = ora('正在解析GitHub URL...').start();

  try {
    // 解析GitHub URL
    const { owner, repo } = GitHubClient.parseGitHubUrl(blogUrl);

    spinner.text = '正在获取issues列表...';

    // 创建GitHub客户端
    const token = options.token || process.env.GITHUB_TOKEN;
    const client = new GitHubClient({
      owner,
      repo,
      ...(token && { token }),
    });

    // 获取所有issues
    const issues = await client.getIssues('all');

    if (issues.length === 0) {
      spinner.warn(chalk.yellow('未找到任何issues'));
      return;
    }

    const converter = new MarkdownConverter();
    const outputDir = options.output || './output';
    const articlesDir = path.join(outputDir, 'articles');

    // 创建文章目录
    const savedPaths: string[] = [];

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];

      spinner.text = `正在导出文章 ${i + 1}/${issues.length}: ${issue.title}`;

      // 转换为Markdown
      const markdown = converter.convertIssueToMarkdown(issue);

      // 生成文件名 (使用issue编号和标题)
      const filename = `${issue.number}-${converter.sanitizeFilename(
        issue.title,
      )}.md`;

      // 保存文件
      const savedPath = await converter.saveToFile(
        markdown,
        filename,
        articlesDir,
      );
      savedPaths.push(savedPath);

      // 避免API限制，添加小延迟
      if (i < issues.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // 生成目录文件
    spinner.text = '正在生成目录文件...';
    const tocMarkdown = converter.generateTocMarkdown(issues);
    const tocPath = await converter.saveToFile(
      tocMarkdown,
      'README.md',
      outputDir,
    );

    spinner.succeed(chalk.green(`所有文章导出成功！`));

    console.log(chalk.blue(`\n导出统计:`));
    console.log(chalk.gray(`- 仓库: ${owner}/${repo}`));
    console.log(chalk.gray(`- 文章数量: ${issues.length}`));
    console.log(chalk.gray(`- 输出目录: ${outputDir}`));
    console.log(chalk.gray(`- 目录文件: ${tocPath}`));
    console.log(chalk.gray(`- 文章目录: ${articlesDir}`));
  } catch (error) {
    spinner.fail(chalk.red(`导出失败: ${(error as Error).message}`));
    process.exit(1);
  }
}
