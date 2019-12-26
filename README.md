# github-enhance

本项目立足于 node 爬虫技术，实践方向为 GitHub 用户体验的增强

## Install

First, install [nodemon](https://github.com/remy/nodemon) & [ts-node](https://github.com/TypeStrong/ts-node/) globally.

```bash
$ npm i -g nodemon ts-node
```

Then, clone the repo.

```bash
$ git clone https://github.com/yanyue404/github-enhance.git
```

Install the dependencies.

```bash
$ cd github-enhance
$ npm install
```

## Usage

### 文件导出

为使用 GitHub issues 写博客的博主提供 全部导出方案（**markdown** 格式），[使用说明](./docs/github-issues-export.md)

### 命令行使用

```bash
# 输出单个 GitHub issues 链接的 markdown 内容
yarn log:issues [github issues url]

# 输出 GitHub blog issues 的文章目录
yarn log:articles [github blog url]
```

![](./screenshot/issues.svg)

## Thanks

- [Crawler-for-Github-Trending](https://github.com/ZY2071/Crawler-for-Github-Trending)

## License

MIT
