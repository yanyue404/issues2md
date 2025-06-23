import chalk from 'chalk';
import ora from 'ora';
import { GitHubClient } from '../utils/github';
import { MarkdownConverter } from '../utils/markdown';
import { CLIOptions } from '../types';

export async function exportToc(
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

    // 获取所有open状态的issues（与原版保持一致）
    const issues = await client.getIssues('open');

    if (issues.length === 0) {
      spinner.warn(chalk.yellow('未找到任何issues'));
      return;
    }

    spinner.text = '正在生成目录...';

    // 生成高级目录Markdown（与原版格式一致）
    const converter = new MarkdownConverter();
    const tocMarkdown = converter.generateAdvancedTocMarkdown(issues);

    // 生成文件名（与原版保持一致）
    const blogName = `${owner}@${repo}`;
    const filename = `${blogName}.md`;
    const outputDir = options.output || './docs';

    spinner.text = '正在保存目录文件...';

    const savedPath = await converter.saveToFile(
      tocMarkdown,
      filename,
      outputDir,
    );

    spinner.succeed(chalk.green(`目录导出成功！文件保存至: ${savedPath}`));

    console.log(chalk.blue(`\n导出信息:`));
    console.log(chalk.gray(`- 仓库: ${owner}/${repo}`));
    console.log(chalk.gray(`- 共找到: ${issues.length} 个open状态的issues`));
    console.log(chalk.gray(`- 文件名: ${filename}`));
    console.log(chalk.gray(`- 保存目录: ${outputDir}`));

    // 按标签统计
    const labelStats: Record<string, number> = {};
    issues.forEach((issue) => {
      const label = issue.labels.length > 0 ? issue.labels[0].name : '未分类';
      labelStats[label] = (labelStats[label] || 0) + 1;
    });

    console.log(chalk.blue(`\n分类统计:`));
    Object.entries(labelStats).forEach(([label, count]) => {
      console.log(chalk.gray(`- ${label}: ${count} 篇`));
    });
  } catch (error) {
    spinner.fail(chalk.red(`导出失败: ${(error as Error).message}`));
    process.exit(1);
  }
}
