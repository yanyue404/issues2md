## 前言

async 函数虽然说可以将异步代码用同步的方式书写，但是如果把可以异步的方法使用同步写了，那可就糟糕了...

## 同步async（串行）

```js
const fetch = require('node-fetch');

const sleep = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

async function getZhihuColumn(id) {
  await sleep(2000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  console.time('showColumnInfo');

  // 串行
  const feweekly = await getZhihuColumn('feweekly');
  const toolingtips = await getZhihuColumn('toolingtips');

  console.log(`NAME: ${feweekly.title}`);
  console.log(`INTRO: ${feweekly.intro}`);

  console.log(`NAME: ${toolingtips.title}`);
  console.log(`INTRO: ${toolingtips.intro}`);

  console.timeEnd('showColumnInfo');
};
showColumnInfo();
```

**打印结果：**

```shell
NAME: 前端周刊
INTRO: 在前端领域跟上时代的脚步，广度和深度不断精进
NAME: tooling bits
INTRO: 工欲善其事必先利其器
showColumnInfo: 4391.631ms
```

## 异步async （并行）

```js
const fetch = require('node-fetch');

const sleep = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

async function getZhihuColumn(id) {
  await sleep(2000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  console.time('showColumnInfo');

  // 并行
  const feweeklyPromise = getZhihuColumn('feweekly');
  const toolingtipsPromise = getZhihuColumn('toolingtips');
  const feweekly = await feweeklyPromise;
  const toolingtips = await toolingtipsPromise;

  console.log(`NAME: ${feweekly.title}`);
  console.log(`INTRO: ${feweekly.intro}`);

  console.log(`NAME: ${toolingtips.title}`);
  console.log(`INTRO: ${toolingtips.intro}`);

  console.timeEnd('showColumnInfo');
};
showColumnInfo();
```

**打印结果：**

```shell
NAME: 前端周刊
INTRO: 在前端领域跟上时代的脚步，广度和深度不断精进
NAME: tooling bits
INTRO: 工欲善其事必先利其器
showColumnInfo: 2245.060ms
```

#### 参考链接

-   [ASYNC/AWAIT 使用警示](http://huihuawk.com/front/async-await/)
-   [How to escape async/await hell](https://www.freecodecamp.org/news/avoiding-the-async-await-hell-c77a0fb71c4c/)
-   [github/course-javascript-async-await](https://github.com/wangshijun/course-javascript-async-await) - Source code for course "asynchronous javascript with async/await"