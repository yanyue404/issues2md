# github-export

Export Github (Issues, Stars, Following) to markdown/json file

## Install

First, install [nodemon](https://github.com/remy/nodemon) & [ts-node](https://github.com/TypeStrong/ts-node/) globally.

```bash
$ npm i -g nodemon ts-node
```

Then, clone the repo.

```bash
$ git clone https://github.com/yanyue404/github-export.git
```

Install the dependencies.

```bash
$ cd github-export
$ npm install
```

## Usage

### 1. Issues export

- 导出 Repo 所有 Issues

为使用 GitHub issues 写博客的博主提供 全部导出方案（**markdown** 格式），[使用说明](./docs/github-issues-export.md)

- 命令行输出 issue 文件内容

```bash
yarn log:issues [github issues url]
```

- 导出 Repo issues 资源的 json 列表，[data/articles.json](./data/articles.json)

```bash
yarn export:articles [github blog url]
```

- 导出 Repo issues 资源的文章目录，[toc/README.md](./toc/README.md)

```bash
yarn export:toc [github blog url]
```

### 2. Stars export

导出 GitHub 账户 star 的项目，导出 [json](./data/stars.json) 以及 [markdown](./docs/stars.md) 文件

```bash
yarn export:stars [github url]
```

### 3. Following export

导出 GitHub 账户 following 的项目，导出 [json](./data/following.json) 以及 [markdown](./docs/following.md) 文件

```bash
yarn export:following [github url]
```

## Thanks

- https://github.com/ZY2071/Crawler-for-Github-Trending
- https://developer.github.com/v3/
- https://github.com/ttop5/issue-blog

## License

MIT
