## 前言

此文章是笔者在 github 使用中的一些经验性总结，学习的新姿势会同步更新，记录。

### 学习资料

**1\. 新手推荐**

-   [Git 教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
-   [版本控制入门 – 搬进 Github](http://www.imooc.com/learn/390)

**2\. 帮助文档**

-   [Git --fast-version-control](https://git-scm.com/book/zh/v2)
-   [官方网站](https://help.github.com/) / [基础中文翻译](https://github.com/waylau/github-help)
-   [Git 飞行规则(Flight Rules)](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
-   [GitHub 秘籍](https://github.com/tiimgreen/github-cheat-sheet/blob/master/README.zh-cn.md#%E8%B4%A1%E7%8C%AE%E8%80%85%E6%8C%87%E5%8D%97)
-   [GotGitHub: an open source E-book about GitHub in Chinese](https://github.com/gotgit/gotgithub)
-   [git-recipes](https://github.com/geeeeeeeeek/git-recipes) - 高质量的 Git 中文教程
-   [GitHub 漫游指南 by phodal](https://github.com/phodal/github)

## 一、github markdown 语法介绍

> 写好 md 很重要 !!!

-   [中文技术文档的写作规范 by ruanyifeng](https://github.com/ruanyf/document-style-guide)
-   [guodongxiaren/README README 文件语法解读](https://github.com/guodongxiaren/README)
-   [emoji-list/ github 支持的 emojj 表情](https://github.com/caiyongji/emoji-list)
-   [GitHub 上 README 中的漂亮徽章](https://shields.io/)

## 二、保证基本使用

### 1\. 在公司的内网如需要配置代理

github 上可以使用 https 进行访问。

```shell
$ git config --global http.proxy http://web-proxy.oa.com:8080
```

> 但是这样可以 clone 了。但是如果要 push 代码，那就麻烦了。每次都需要输入密码,接着往下看。

### 2\. 上传前设置`.gitignore` 过滤

案例介绍，如前端 项目中充满数量庞大依赖文件的`node_modules`，我们不需要上传，靠`package.json`文件下载依赖包就可以

```shell
*.DS_Store
node_modules # 过滤项目中名为 node_modules 的文件夹，做上传例外操作
bower_components
.sass-cache
npm-debug.log
.idea
.vscode
```

```shell
# git-忽略版本控制内某些文件的修改
git update-index --assume-unchanged application/Everything/Everything.ini
```

### 3\. git commit log

优雅的提交 `code`，为 commit 自己的每次 commit 设置好的日志, 方便日后追溯:

-   Head
    -   type: feat 新特性, fix 修改问题, docs 文档, style 格式, refactor 重构, test 测试用例, chore 其他修改, 比如构建流程, 依赖管理.
    -   scope:影响范围， 比如: route, component, utils, build... 可省略
    -   subject:简短的提交信息
-   Body
    -   what：详细做了什么
    -   why： 为什么这样做
    -   how： 有什么后果
-   Footer
    -   相关链接

> 补充：使用 svn 小乌龟提交代码没有强制需要写 commit log , 建议大家都写

### 4\. git push 免密码

每次提交代码时需要输入用户名密码，则说明你在从仓库中 clone 代码时使用的是 HTTPS 的 key 进行拉取代码。而使用 SSH key 拉取代码时，则不需要。

(1). 创建文件 `.git-credentials` 存储 GIT 用户名和密码

```shell
# 创建
touch .git-credentials
# 在vim中打开
vim .git-credentials
# 文件内容
https://{username}:{password}@github.com
```

(2). 长期存储密码,进入 git bash 终端， 输入如下命令:

```shell
git config --global credential.helper store
```

经过这样操作后就可以`免密登录`了

**注意事项**

文件结构要与初始化连接 `github` 的`.gitconfig`文件在同级别目录下

## 三、项目 github 平台展示

### 1\. `gh-pages` 分支发布在线访问

在自己的 github 项目上添加`gh-pages`分支，并保证里面有需要展示的代码，以`index.html`作为入口就 ok，可以展示项目了

-   参考：将本项目下的 dist 文件夹内容发布到远端的 `gh-pages` 分支

```shell
git subtree push --prefix=dist origin gh-pages
```

#### 栗子

-   [项目 vip](https://github.com/xiaoyueyue165/vip) [在线访问](https://xiaoyueyue165.github.io/vip/%E5%94%AF%E5%93%81%E4%BC%9A%E9%A6%96%E9%A1%B5/)
-   [项目 react-yanxuan](https://github.com/xiaoyueyue165/react-yanxuan) [在线访问](https://xiaoyueyue.org/react-yanxuan/)

### 2\. github 修改项目语言显示

在项目根目录添加文件名为`.gitattributes`的文本文件:

```shell
touch .gitattributes
```

写入:

```js
*.js linguist-language=javascript
*.css linguist-language=javascript
*.html linguist-language=javascript
```

意思就是将`.js`、`.css`、`.html`当作 **javascript** 语言来统计,简单有效

> 查看案例，将展示的语言变为`javascript`\=> [King-of-glory](https://github.com/xiaoyueyue165/King-of-glory)

### 3\. 上传文件出错

(1). **git 推送出现 "fatal: The remote end hung up unexpectedly"**

原因：上传的文件过大,单个文件均小于 `100M`  
解决办法：在项目.`git`文件夹下寻找`config`文件，添加如下代码：

```shell
[http]
postBuffer = 524288000
```

(2). 用于上传单个文件大于 100M 失败时使用

-   [git-lfs](https://github.com/git-lfs/git-lfs)

## 四、github 团队组织

-   [google](https://github.com/google)
-   [facebook](https://github.com/facebook)
-   [apache](https://github.com/apache)
-   [microsoft](https://github.com/microsoft)
-   [mozilla](https://github.com/mozilla)
-   [codrops](https://github.com/codrops)
-   [twitter](https://github.com/twitter)
-   [square](https://github.com/square)
-   [googlesamples](https://github.com/googlesamples)
-   [Netflix](https://github.com/Netflix)
-   [github](https://github.com/github)
-   [airbnb](https://github.com/airbnb)

#### 参考链接

-   [优雅的提交你的 Git Commit Message](https://zhuanlan.zhihu.com/p/34223150)
-   [Git 提交的正确姿势：Commit message 编写指南](https://www.oschina.net/news/69705/git-commit-message-and-changelog-guide)
-   [如何用 Github 的 gh-pages 分支展示自己的项目](https://www.cnblogs.com/MuYunyun/p/6082359.html)
-   [「Git」合并多个 Commit](https://www.jianshu.com/p/964de879904a)
-   [Git log 不太好看，我们来合并 commit 吧](https://learnku.com/articles/9377/git-log-is-not-very-good-lets-merge-commit)
-   [国内github团队的开源地址](https://github.com/niezhiyang/open_source_team)