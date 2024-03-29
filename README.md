# issues2md

[![NPM version](https://img.shields.io/npm/v/issues2md.svg?style=flat)](https://www.npmjs.com/package/issues2md) ![NPM](https://img.shields.io/npm/l/issues2md)

Export Github Issues (for bloggers) to markdown file

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install issues2md -g
```

## Usage

Configure network proxy access (**Off by default**) , **project.config.js** .

```js
module.exports = {
  // * 国内代理访问 github , toc 与 articles 命令需要
  // PROXY: 'http://127.0.0.1:11181',

  // * 不需要代理访问 github
  PROXY: false,
};
```

Export simgle issue as Markdown:

```bash
issues2md issue <issue_URL>
```

Export Github Blog issues list as Markdown:

```bash
issues2md toc <blog_URL>
```

Export Github Blog issues as Markdown:

```bash
issues2md articles <blog_URL>
```

## Contribution

```sh
$ git clone https://github.com/rainbow-design/issues2md.git

$ cd issues2md

$ npm link
```

## License

MIT
