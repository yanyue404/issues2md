# github-to-md

[![NPM version](https://img.shields.io/npm/v/github-to-md.svg?style=flat)](https://www.npmjs.com/package/github-to-md)

Export Github (Issues, Stars, Following) to markdown file

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install github-to-md -g
```

## Usage

Create a folder to store the export results `docs`, Locate to `docs`:

```sh
mkdir docs && cd docs
```

Export Github User Started list as Markdown:

```bash
github-to-md star [github_userName]
```

Export Github User following list as Markdown:

```bash
github-to-md follow [github_userName]
```

Export simgle issue as Markdown:

```bash
github-to-md issue [issue_URL]
```

Export Github Blog issues list as Markdown:

```bash
github-to-md toc [blog_URL]
```

Export Github Blog issues as Markdown:

```bash
github-to-md articles [blog_URL]
```

## License

MIT
