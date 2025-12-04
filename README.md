# issues2md

[![NPM version](https://img.shields.io/npm/v/issues2md.svg?style=flat)](https://www.npmjs.com/package/issues2md) ![NPM](https://img.shields.io/npm/l/issues2md)

Export Github Issues (for bloggers) to markdown file

## 特性

- 🚀 使用 TypeScript 重写，提供完整的类型支持
- 📦 支持 pnpm 包管理器
- 🎯 Node.js 16.16.0+ 支持
- 🔧 模块化设计，可作为 CLI 工具或 Node.js 库使用
- 🎨 美观的命令行界面，带有进度指示器
- 📄 灵活的 Markdown 输出格式

## 系统要求

- Node.js >= 16.16.0
- pnpm >= 8.1.0

## 安装

### 全局安装

```bash
pnpm install -g issues2md
```

### 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd issues2md

# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 开发模式
pnpm run dev
```

## 使用方法

### 命令行工具

导出单个 issue 为 Markdown：

```bash
issues2md issue <issue_URL> [options]
```

导出 Github Blog issues 列表为目录：

```bash
issues2md toc <blog_URL> [options]
```

导出 Github Blog 所有 issues 为 Markdown 文件：

```bash
issues2md articles <blog_URL> [options]
```

### 选项

- `-o, --output <dir>`: 指定输出目录 (默认: `./output`)
- `-t, --token <token>`: GitHub 访问令牌 (也可通过环境变量 `GITHUB_TOKEN` 设置)

### 示例

```bash
# 导出单个 issue
issues2md issue https://github.com/yanyue404/blog/issues/270

# 导出博客目录
issues2md toc https://github.com/yanyue404/blog -o ./my-blog

# 导出所有文章
issues2md articles https://github.com/yanyue404/blog -o ./my-blog

# 使用 GitHub token
issues2md articles https://github.com/yanyue404/blog -t your_github_token
```

### 作为 Node.js 库使用

```typescript
import { GitHubClient, MarkdownConverter, exportIssue } from 'issues2md';

// 创建 GitHub 客户端
const client = new GitHubClient({
  owner: 'yanyue404',
  repo: 'blog',
  token: 'your_github_token', // 可选
});

// 获取 issue
const issue = await client.getIssue(270);

// 转换为 Markdown
const converter = new MarkdownConverter();
const markdown = converter.convertIssueToMarkdown(issue);

// 或者直接使用命令函数
await exportIssue('https://github.com/yanyue404/blog/issues/270', {
  output: './output',
  token: 'your_github_token',
});
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式 (监听文件变化)
pnpm run dev

# 构建
pnpm run build

# 代码检查
pnpm run lint

# 修复代码风格问题
pnpm run lint:fix

# 清理构建文件
pnpm run clean
```

## 网络代理

如果需要配置网络代理访问：

```bash
# 设置环境变量
export https_proxy=http://127.0.0.1:33210
export http_proxy=http://127.0.0.1:33210

# 然后运行命令
issues2md articles https://github.com/yanyue404/blog
```

## 项目结构

```
src/
├── commands/           # CLI 命令实现
│   ├── issue.ts       # 单个 issue 导出
│   ├── toc.ts         # 目录导出
│   └── articles.ts    # 批量文章导出
├── utils/             # 工具函数
│   ├── github.ts      # GitHub API 客户端
│   └── markdown.ts    # Markdown 转换器
├── types/             # TypeScript 类型定义
│   └── index.ts
├── cli.ts            # CLI 入口文件
└── index.ts          # 库入口文件
```

## License

MIT
