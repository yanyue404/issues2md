# issues2md

[![NPM version](https://img.shields.io/npm/v/issues2md.svg?style=flat)](https://www.npmjs.com/package/issues2md) ![NPM](https://img.shields.io/npm/l/issues2md)

Export Github Issues (for bloggers) to markdown file

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install issues2md -g
```

## Usage

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

## Proxy

If needed configure network proxy access (**Terminal Agent**)

```bash
# use git bash
export https_proxy=http://127.0.0.1:33210 http_proxy=http://127.0.0.1:33210
```

## License

MIT
