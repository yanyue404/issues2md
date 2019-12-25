## How to use

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

## Options

The configuration file is [config.json](./config/config.json)

```json
{
  "github": {
    "blog": "https://github.com/mqyqingfeng/Blog"
  },
  "folder": "test",
  "year": false
}
```

| Option        | Valid values                                                                                  |
| :------------ | :-------------------------------------------------------------------------------------------- |
| `github.blog` | address of github repositories with issues                                                    |
| `folder`      | export to folder                                                                              |
| `year`        | whether to create new save to year folder (Such as save to : `articles/2019`,`articles/2018`) |

## How to export

Start app :

```bash
# Startup project
$ npm start or npm dev

# Started successfully !

# [nodemon] starting `node app.js`
# Listening on http://localhost:3000!
```

Open http://localhost:3000/ , you can see the github issues we will export.

![Snipaste_2019-11-27_20-24-37.png](http://ww1.sinaimg.cn/large/df551ea5ly1g9cvco38c6j21d00qbgp3.jpg)

Open http://localhost:3000/api , this is the api information needed to export issues.

![Snipaste_2019-11-27_20-25-49.png](http://ww1.sinaimg.cn/large/df551ea5ly1g9cvdamsj1j20tz0rd0te.jpg)

Access http://localhost:3000/export ,the markdown file starts to export. Below is the log result printed by the console.

![Snipaste_2019-11-27_20-28-26.png](http://ww1.sinaimg.cn/large/df551ea5ly1g9cve5zcs4j20qq0s8q8f.jpg)

You can beautify the results you get.

```bash
# Format file
$ npm prettier
```
