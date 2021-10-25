## 目录

-   1.  面临痛点
-   2.  Prettier 配置代码风格自动格式化
    
    -   （1）VS Code 保存时自动格式化
    -   （2）Git Hooks 提交自动格式化
        -   pre-commit
        -   husky (新版)
    -   （3）小结
-   3.  ESlint 静态代码检查
-   4.  参考链接

## 一、面临痛点

项目组多人开发场景，由于相互间代码格式化风格不统一，简单修改项目单文件的几行代码修改，保存不敢使用自己的格式化工具，而一旦格式化就很容易引发多行的代码的修改，不利于代码提交 review，快速定位有效代码变更。因此，统一组内代码格式化风格尤为重要。

[![](https://camo.githubusercontent.com/a305e87d68984c0f1f27c4c2febbd6b762158c4dbbbec2451c83fe860c884bd2/68747470733a2f2f65637561742e746b2e636e2f746b636d732f66696c652f75706c6f61642f746b2f66696c655f6b73682f646966666572656e742d666f726d61742e706e67)](https://camo.githubusercontent.com/a305e87d68984c0f1f27c4c2febbd6b762158c4dbbbec2451c83fe860c884bd2/68747470733a2f2f65637561742e746b2e636e2f746b636d732f66696c652f75706c6f61642f746b2f66696c655f6b73682f646966666572656e742d666f726d61742e706e67)

（注）上图为未做代码修改，仅格式化造成的变更

[![](https://camo.githubusercontent.com/3f27fc34fdead23da2763de98b5c475d94e43fef828fe7941540e05eda641db3/68747470733a2f2f65637561742e746b2e636e2f746b636d732f66696c652f75706c6f61642f746b2f66696c655f6b73682f7265766965772e676966)](https://camo.githubusercontent.com/3f27fc34fdead23da2763de98b5c475d94e43fef828fe7941540e05eda641db3/68747470733a2f2f65637561742e746b2e636e2f746b636d732f66696c652f75706c6f61642f746b2f66696c655f6b73682f7265766965772e676966)

（注）代码 review 例子，格式化造成的无关变更

## 二、Prettier 配置代码风格自动格式化

### 1、VS Code 保存时自动格式化

（1） 在 VSCode 中安装 prettier 格式化插件 【Prettier - Code formatter  
】，格式化支持的文件类型有 `{js,jsx,vue,css,html,scss,md,json,wxml,wxss,wxs}`等。

（2） 保存时自动格式化（修改 VSCode 配置文件 **setting.json**）

```js
{
  "files.autoSave": "afterDelay", // 延时后保存
  "editor.formatOnSave": true, // 保存时自动格式化代码

  // 默认格式化插件 prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 每一种语言设置默认格式化规则
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
   "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}
```

（3）配置自定义格式化规则

我们可以将格式化规则写在项目根目录的 `.prettierrc`（还支持 `prettierrc.js`） 配置文件或是保存在自己的 VSCode 配置文件 **setting.json** 中。

**.prettierrc**

```js
{
  "printWidth": 120, // 超过最大值换行
  "semi": true, //  要分号分号
  "singleQuote": false //  要单引号
}
```

**setting.json**

```js
{
  "editor.rulers": [120], // 辅助标尺
  // ! 自定义 prettier 格式配置
  "prettier.printWidth": 120, // 超过最大值换行
  "prettier.semi": true, // 句尾添加分号
  "prettier.singleQuote": false // 要单引号
  // ? 格式化 prettier end
}
```

> 建议将上面自定义 prettier 格式配置的内容单独放置在专门的配置文件中，这一点在多人开发统一规范很有必要。

（4）设置格式化过滤项文件（根目录`.prettierignore` 文件）

**.prettierignore**

```shell
# 忽略文件夹
build
coverage

# 过滤所有的 html 文件
*.html

# 过滤所有名为 ignore.js 的文件
ignore.js
```

### 2、Git Hooks 提交自动格式化

在 `git commit` 之前，先强制执行 prettier 格式化（防止某些成员开发期间不开启编辑器格式化）再提交。

最有效的解决方案就是将 Lint 校验放到本地，常见做法是使用 [husky](https://github.com/typicode/husky) 或者 [pre-commit](https://github.com/observing/pre-commit) 在本地提交之前先做一次 Lint校验。

### pre-commit

（1）安装相关依赖

```shell
$ npm install pre-commit lint-staged prettier -D
```

> 安装 `pre-commit` 将会在 .git/hooks 文件夹下生成一个 `pre-commit` 文件，这个 Git 钩子可以让我们在提交代码前做一些事情。

（2）配置自动格式化钩子

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "pre-commit": "lint-staged",
   "lint-staged": {
    "*.{js,jsx,vue,css,html,scss,md,json,wxml,wxss,wxs}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

格式化命令行输出效果：

```shell
yue@03-709-6151 MINGW64 /d/Self/react-accounts-app (master)
$ git add .

yue@03-709-6151 MINGW64 /d/Self/react-accounts-app (master)
$ git commit -m "test: cmd commit"
[STARTED] Preparing...
[SUCCESS] Preparing...
[STARTED] Running tasks...
[STARTED] Running tasks for *.{js,jsx,vue,css,html,scss,md,json,wxml,wxss,wxs}
[STARTED] prettier --write
[SUCCESS] prettier --write
[SUCCESS] Running tasks for *.{js,jsx,vue,css,html,scss,md,json,wxml,wxss,wxs}
[SUCCESS] Running tasks...
[STARTED] Applying modifications...
[SUCCESS] Applying modifications...
[STARTED] Cleaning up...
[SUCCESS] Cleaning up...
[master e85957a] test: cmd commit
 1 file changed, 2 insertions(+)

yue@03-709-6151 MINGW64 /d/Self/react-accounts-app (master)
$ git push
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 4 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 412 bytes | 412.00 KiB/s, done.
Total 5 (delta 3), reused 0 (delta 0), pack-reused 0
To http://xxx.com/react-accounts-app.git
   316adfb..e85957a  master -> master

```

（3）配置自定义格式化规则（同上）

（4）设置格式化过滤项文件（同上）

### husky(新版)

**新版 husky 的工作原理**

新版的 husky 使用了从 git 2.9 开始引入的一个新功能 core.hooksPath。core.hooksPath 可以让你指定 git hooks 所在的目录而不是使用默认的.git/hooks/。这样 husky 可以使用 husky install 将 git hooks 的目录指定为.husky/，然后使用 husky add 命令向.husky/中添加 hook。通过这种方式我们就可以只添加我们需要的 git hook，而且所有的脚本都保存在了一个地方（.husky/目录下）因此也就不存在同步文件的问题了。

（1）安装 husky

```shell
npm install -D husky
```

（2）在 packgae.json 中添加 prepare 与 lint-staged 脚本

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint-staged": "lint-staged"
  },
   "lint-staged": {
    "*.{js,jsx,vue,css,html,scss,md,json,wxml,wxss,wxs}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

prepare 脚本会在 npm install（不带参数）之后自动执行。也就是说当我们执行 npm install 安装完项目依赖后会执行 husky install 命令，该命令会创建.husky/目录并指定该目录为 git hooks 所在的目录。

（3）添加 git hooks，运行一下命令创建 git hooks

```shell
npx husky add .husky/pre-commit "lint-staged"
```

运行完该命令后我们会看到 `.husky/`目录下新增了一个名为 pre-commit 的 shell 脚本。也就是说在在执行 git commit 命令时会先执行 pre-commit 这个脚本。pre-commit 脚本内容如下：

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

可以看到该脚本的功能就是执行 npm run lint-staged 这个命令

（4）其他人 npm install

注意下面的关键日志输出，该命令会创建.husky/目录并指定该目录为 git hooks 所在的目录，husky 配置的钩子就可以正常使用了。

```shell
> husky install

husky - Git hooks installed
```

```shell
$ npm i

> core-js@2.6.12 postinstall D:\Powerful\h5-editer\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"

Thank you for using core-js ( https://github.com/zloirock/core-js ) for polyfilling JavaScript standard library!

The project needs your help! Please consider supporting of core-js on Open Collective or Patreon:
> https://opencollective.com/core-js
> https://www.patreon.com/zloirock

Also, the author of core-js ( https://github.com/zloirock ) is looking for a good job -)


> esbuild@0.12.8 postinstall D:\Powerful\h5-editer\node_modules\esbuild
> node install.js


> postinstall-postinstall@2.1.0 postinstall D:\Powerful\h5-editer\node_modules\postinstall-postinstall
> node ./run.js


> vite-vue-starter@0.0.0 prepare D:\Powerful\h5-editer
> husky install

husky - Git hooks installed
npm WARN vite-vue-starter@0.0.0 No repository field.
npm WARN vite-vue-starter@0.0.0 No license field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})

added 615 packages from 1291 contributors and audited 616 packages in 84.989s

51 packages are looking for funding
  run `npm fund` for details

found 206 vulnerabilities (16 moderate, 190 high)
  run `npm audit fix` to fix them, or `npm audit` for details

```

**需要注意的点**

使用新版本 husky 进行配置后，下面这种配置方式就不再需要了，可以移除。

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

### 3、小结

方案一：VS Code 保存时自动格式化。配置完成使用 `Ctrl+S` 保存代码就可以自动格式化了 ！由开发者来决定哪些文件需要格式化。

方案二：Git 整合提交自动格式化，配置完成后提交代码就可以自动格式化了 ！需要注意的是配置不需要格式化的过滤项文件。

其实，这两种方案也可以结合起来，在本地开发的时候进行自动格式化，提交前的时候也进行格式化操作，确保代码风格一致性。

最佳的 lint 规范流程就是推荐团队成员先在自己的编辑器中配置 eslint，在 webpack 中配置并开启 eslint-loader 错误提示，这样平时写的时候编辑器就能帮你修正一些简单的格式错误，同时提醒你有哪些不符合 lint 规范的的地方，并在命令行中提示你错误。

但这并不是强制的，有些团队成员或者说刚来的实习生没有在编辑器中配置或者无视命令行中提示的错误，这时候就需要配置pre-commit 这种强制性校验的东西，保证所有提交到远程仓库的内容都是符合团队规范的。

## 三、ESlint 静态代码检查

TODO

## 参考链接

-   [husky自定义目录钩子的正确使用](https://blog.csdn.net/Banterise/article/details/115206267)
-   [Git Commit Message校验踩坑指南](https://zhuanlan.zhihu.com/p/391709116)
-   [husky使用总结](https://zhuanlan.zhihu.com/p/366786798)
-   [vue-element-admin - git-hook](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/git-hook.html)
-   [VS Code Prettier + ESlint 格式化Vue代码及遇到问题](https://zhuanlan.zhihu.com/p/64627216)

The text was updated successfully, but these errors were encountered: