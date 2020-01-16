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

## Configuration

配置文件位于 `config/config.json`，详细如下:

```json
{
  "github": {
    "homepage": "https://github.com/yanyue404",
    "blog": "https://github.com/yanyue404/blog",
    "token": "MWM2YmE5NmMwODJhODgyYzBiZmM2ZWExNGVhNzFhYjFkZTM4MzcwYw=="
  },
  "year": true
}
```

### 获取 GitHub Token

点击 [这里](https://github.com/settings/tokens/new)，勾选以下两项：

```
read: user        Read all user profile data
user: email       Access user email addresses (read-only)
```

⚠️ 警 告 ：别的不要勾选，以免造成账号安全问题。

如果你的项目是属于一个组织的，还需要勾选一个权限：

```
read: org         Read org and team membership
```

#### GitHub Token 进行 Base64 加密

打开 Chrome 的 Console，运行：

```
window.btoa('{你的 GitHub Token}')
```

如果你把 Token 直接明文推到 GitHub 仓库中，此 Token 就会立马失效，所以需要加密混淆。

## Usage

### Issues export

（1）导出 Repo 所有 Issues

为使用 GitHub issues 写博客的博主提供文章导出方案（**markdown** 格式），[articles](./articles/) 目录

```bash
yarn export:issues
```

（2）导出 Repo issues 资源的 json 列表，[json/articles.json](./json/articles.json)

```bash
yarn export:articles
```

（3）导出 Repo issues 资源的文章目录，[toc/README.md](./toc/README.md)

```bash
yarn export:toc
```

### Stars export

导出 GitHub 账户 star 的项目，导出 [json](./json/stars.json) 以及 [markdown](./docs/stars.md) 文件

```bash
yarn export:stars
```

### Following export

导出 GitHub 账户 following 的项目，导出 [json](./json/following.json) 以及 [markdown](./docs/following.md) 文件

```bash
yarn export:following
```

## Thanks

- https://github.com/ZY2071/Crawler-for-Github-Trending
- https://developer.github.com/v3/
- https://github.com/ttop5/issue-blog

## License

MIT
