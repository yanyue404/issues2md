import {
  GitHubClient,
  MarkdownConverter,
  exportIssue,
  exportToc,
  exportArticles,
} from '../src';

async function example() {
  // 示例1: 使用 GitHubClient 直接操作
  console.log('🔍 示例1: 直接使用 GitHubClient');

  const token = process.env.GITHUB_TOKEN;
  const client = new GitHubClient({
    owner: 'yanyue404',
    repo: 'blog',
    ...(token && { token }),
  });

  try {
    // 获取单个issue
    const issue = await client.getIssue(270);
    console.log(`获取到issue: ${issue.title}`);

    // 转换为Markdown
    const converter = new MarkdownConverter({
      includeLabels: true,
      includeMetadata: true,
    });

    const markdown = converter.convertIssueToMarkdown(issue);
    await converter.saveToFile(
      markdown,
      'example-issue.md',
      './examples/output',
    );

    console.log('✅ 单个issue转换完成');
  } catch (error) {
    console.error('❌ 获取issue失败:', error);
  }

  // 示例2: 使用便捷函数
  console.log('\n🚀 示例2: 使用便捷函数');

  try {
    // 导出单个issue
    await exportIssue('https://github.com/yanyue404/blog/issues/270', {
      output: './examples/output',
      token: process.env.GITHUB_TOKEN,
    });

    // 导出目录
    await exportToc('https://github.com/yanyue404/blog', {
      output: './examples/output',
      token: process.env.GITHUB_TOKEN,
    });

    console.log('✅ 所有示例完成');
  } catch (error) {
    console.error('❌ 导出失败:', error);
  }
}

// 运行示例
if (require.main === module) {
  example().catch(console.error);
}
