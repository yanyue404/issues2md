import chalk from 'chalk';
import ora from 'ora';
import { GitHubClient } from '../utils/github';
import { MarkdownConverter } from '../utils/markdown';
import { CLIOptions } from '../types';

export async function exportIssue(
  issueUrl: string,
  options: CLIOptions = {},
): Promise<void> {
  const spinner = ora('正在解析GitHub URL...').start();

  try {
    // 解析GitHub URL
    const { owner, repo, issueNumber } = GitHubClient.parseGitHubUrl(issueUrl);

    if (!issueNumber) {
      throw new Error('URL中未找到issue编号');
    }

    spinner.text = '正在获取issue信息...';

    // 创建GitHub客户端
    const token = options.token || process.env.GITHUB_TOKEN;
    const client = new GitHubClient({
      owner,
      repo,
      ...(token && { token }),
    });

    // 获取issue信息
    const issue = await client.getIssue(issueNumber);

    spinner.text = '正在转换为Markdown...';

    // 转换为Markdown
    const converter = new MarkdownConverter();
    const markdown = converter.convertIssueToMarkdown(issue);

    // 生成文件名
    const filename = `${converter.sanitizeFilename(issue.title)}.md`;
    const outputDir = options.output || './output';

    spinner.text = '正在保存文件...';

    // 保存文件
    const savedPath = await converter.saveToFile(markdown, filename, outputDir);

    spinner.succeed(chalk.green(`Issue导出成功！文件保存至: ${savedPath}`));

    console.log(chalk.blue(`\n标题: ${issue.title}`));
    console.log(chalk.gray(`状态: ${issue.state}`));
    console.log(
      chalk.gray(`创建时间: ${new Date(issue.created_at).toLocaleString()}`),
    );

    if (issue.labels.length > 0) {
      console.log(
        chalk.yellow(`标签: ${issue.labels.map((l) => l.name).join(', ')}`),
      );
    }
  } catch (error) {
    spinner.fail(chalk.red(`导出失败: ${(error as Error).message}`));
    process.exit(1);
  }
}
