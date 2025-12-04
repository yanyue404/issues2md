import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';
import { GitHubIssue, MarkdownOptions } from '../types';

export class MarkdownConverter {
  private options: MarkdownOptions;
  private turndownService: TurndownService;

  constructor(options: MarkdownOptions = {}) {
    this.options = {
      includeLabels: true,
      includeMetadata: true,
      dateFormat: 'YYYY-MM-DD',
      ...options,
    };

    // 初始化turndown服务（与原版保持一致的配置）
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    });

    // 关键配置：保持summary和span标签不被转换（与原版一致）
    this.turndownService.keep(['summary', 'details', 'span']);
  }

  convertIssueToMarkdown(issue: GitHubIssue): string {
    let markdown = '';

    // 添加标题
    markdown += `# ${issue.title}\n\n`;

    // 添加元数据
    if (this.options.includeMetadata) {
      markdown += `> 创建时间: ${this.formatDate(issue.created_at)}\n`;
      markdown += `> 更新时间: ${this.formatDate(issue.updated_at)}\n`;
      markdown += `> 状态: ${issue.state}\n`;
      markdown += `> 链接: [${issue.html_url}](${issue.html_url})\n\n`;
    }

    // 添加标签
    if (this.options.includeLabels && issue.labels.length > 0) {
      const labels = issue.labels.map((label) => `\`${label.name}\``).join(' ');
      markdown += `**标签:** ${labels}\n\n`;
    }

    // 添加内容
    if (issue.body) {
      markdown += `${issue.body}\n`;
    }

    return markdown;
  }

  generateTocMarkdown(issues: GitHubIssue[]): string {
    let markdown = '# 目录\n\n';

    issues.forEach((issue, index) => {
      const date = this.formatDate(issue.created_at);
      const labels =
        issue.labels.length > 0
          ? ` ${issue.labels.map((l) => `\`${l.name}\``).join(' ')}`
          : '';

      markdown += `${index + 1}. [${issue.title}](${
        issue.html_url
      }) - ${date}${labels}\n`;
    });

    return markdown;
  }

  // 新增：生成与原版toc.js一致的目录格式
  generateAdvancedTocMarkdown(issues: GitHubIssue[]): string {
    // 生成年月角标的辅助函数
    const generateDateBadge = (createdAt: string): string => {
      const createDate = new Date(createdAt);
      const year = createDate.getFullYear();
      const month = (createDate.getMonth() + 1).toString().padStart(2, '0');
      return `<span style="background: #e1f5fe; color: #0277bd; padding: 2px 6px; border-radius: 10px; font-size: 0.8em;">${year}-${month}</span>`;
    };

    // 按标签分类文章
    const labelsArr: string[] = [];
    const articles: Record<string, string[]> = {};

    issues.forEach((issue) => {
      const label = issue.labels.length > 0 ? issue.labels[0].name : '未分类';
      const dateBadge = generateDateBadge(issue.created_at);

      if (!labelsArr.includes(label)) {
        labelsArr.push(label);
        articles[label] = [];
      }
      articles[label].push(`[${issue.title}](${issue.html_url}) ${dateBadge}`);
    });

    // 构建HTML内容
    const header = '<h2>目录</h2><br>';

    let sort = '<h2>分类</h2><br>';
    sort += '<ul>';
    labelsArr.forEach((category) => {
      sort += `<li><a href="#${category}"><strong>${category}</strong></a></li>`;
    });
    sort += '</ul><br>';

    let content = '<h2>文章</h2><br>';
    for (const key in articles) {
      content += `<h3>${key}</h3><br>`;
      content += '<ul>';
      articles[key].forEach((article, index, arr) => {
        content += `<li>${article}</li>`;
        if (index === arr.length - 1) {
          content += '<br>';
        }
      });
      content += '</ul>';
    }

    const currentTime = new Date().toISOString().split('T')[0];
    const detailsStart = `<details open>
  <summary>Update time: ${currentTime} by <a href="https://github.com/yanyue404/issues2md">issues2md</a> :sunflower:</summary>`;
    const detailsEnd = '</details>';

    // 组合完整内容并使用turndown转换
    const htmlContent =
      '<body>' +
      header +
      detailsStart +
      sort +
      content +
      detailsEnd +
      '</body>';
    let markdown = this.turndownService.turndown(htmlContent);

    // 清理反斜杠（与原版保持一致）
    markdown = markdown.replace(/\\/g, '');

    return markdown;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  async saveToFile(
    content: string,
    filename: string,
    outputDir: string = './',
  ): Promise<string> {
    const fullPath = path.resolve(outputDir, filename);
    const dir = path.dirname(fullPath);

    // 确保目录存在
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(fullPath, content, 'utf-8');
    return fullPath;
  }

  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
}
