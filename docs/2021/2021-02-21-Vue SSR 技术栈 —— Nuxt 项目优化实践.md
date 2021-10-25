## 目录

-   增加打包命令，根据参数切换测试生产环境
-   静态资源切换 CDNcategory
-   自定义 html 模板
-   优化打包体积
    -   去除重复打包依赖 bn.js（废弃）
    -   加密库 crypto-js 只引入 AES 加密相关（废弃）
    -   按需引入 lodash（废弃）
    -   外部引入 vue、encrypt、vue-awesome-swiper
    -   按需引入 vant、lodash
-   首屏优化
    -   图片懒加载
    -   css 优先加载，JS 后置
-   其他优化
    -   node-sass 更换为 sass

## 一、增加打包命令，根据参数切换测试生产环境

原 package.json 中一般有 dev 和 generate 两个命令，现增加 serve 命令，修改如下：

```js
 "scripts": {
    "serve": "cross-env PATH_TYPE=development nuxt",      //开发环境，环境参数为development
    "dev": "cross-env PATH_TYPE=trial nuxt generate",	  //测试环境，环境参数为trial
    "generate": "cross-env PATH_TYPE=production  nuxt generate",    //生产环境，环境参数为production
    "build": "nuxt build"
  }
```

对应开发环、测试和生产环境打包命令分别为 serve、dev 和 generate，配置完成后测试环境需要在jenkins 下打包，打包命令选择 npm run dev

特殊的，对于采用 Git子模块方式引用的，打包命令需修改为 sh build.sh \[dev|generate\]

```js
"scripts": {
    "serve": "cross-env PATH_TYPE=development nuxt",   //开发环境
    "dev": "sh build.sh dev",     //测试环境
    "generate": "sh build.sh generate",   //生产环境
	"build": "nuxt build"
  }
```

build.sh 也需要做如下更改：

```shell
echo "EXEC git clone -b dev http://gitlab.it.xxx.com/nuxt-common.git "
git clone -b dev http://gitlab.it.xxx.com/nuxt-common.git

if [[ $1 == "dev" ]]; then
    echo '开始编译测试环境'
    cross-env PATH_TYPE=trial nuxt generate
    exit
fi

if [[ $1 == "generate" ]]; then
    echo '开始生产环境编译'
    cross-env PATH_TYPE=production  nuxt generate
    exit
fi

echo '请指定编译方式  dev 或者 generate'
```

在 nuxt.config.js 中增加环境参数配置：

```js
export default {
  mode: "universal",
  env: {
    PATH_TYPE: process.env.PATH_TYPE,
  },
};
```

在项目代码中直接使用 process.env.PATH\_TYPE 直接获取环境参数，例如根据环境参数切换接口 baseUrl

```js
let host = !process.server ? location.origin : "";
//非生产环境使用/hera_insure3
let path =
  process.env.PATH_TYPE !== "production" ? "/hera_insure3" : "/hera_insure_v2";

// 1)实例化一个axios对象 http（根据当前环境配置baseURL）
const http = axios.create({
  baseURL: host + path,
  timeout: 10000,
});
```

## 二、静态资源切换 CDNcategory

目前仅生产环境有 cdn 域名，所以配置中需要区分测试和生产环境，nuxt.config.js 增加如下配置

```js
//项目访问路径
let baseUrl = "/project-path/";
//资源路径前缀，生产环境使用cdn域名
let publicPath =
  process.env.PATH_TYPE !== "production" ? "/_nuxt/" : `//mcdn.xx.cn/${baseUrl}`;
export default {
  mode: "universal",
  router: {
    base: baseUrl, //项目访问路径
  },
  build: {
    publicPath: publicPath, //静态资源路径，默认为/_nuxt/,生产环境配置为 //mcdn.xx.cn
  },
};
```

配置完成后，使用 npm run generate 打包，项目 dist 目录下查看 index.html,静态资源已经切换为//mcdn.xx.cn 域名

```html
<!-- 生产环境打包后静态资源和图片资源域名都是//mcdn.xx.cn -->
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/ab8c55e7bbe08cb5535b.js" as="script">
<!-- 测试环境打包静态资源会在/_nuxt目录下，生产环境打包会在根目录下，因此访问地址稍有不同 -->
<!-- <link rel="preload" href="/project-path/_nuxt/cfe229c4b19f0c0e605f.js" as="script"> -->
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/c37e933a0ed58670cf09.js" as="script">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/82b7242da0af4228da8e.css" as="style">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/89ed111ab3dd0c94c966.js" as="script">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/0b6786c39409821386d9.css" as="style">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/62bb49672485b605cbb5.js" as="script">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/26de14d649e499f9125c.css" as="style">
<link rel="preload" href="//mcdn.xx.cn/tkproperty/prd/S20180209/4e8179eeaba3480b7378.js" as="script">
<link rel="stylesheet" href="//mcdn.xx.cn/tkproperty/prd/S20180209/82b7242da0af4228da8e.css">
<link rel="stylesheet" href="//mcdn.xx.cn/tkproperty/prd/S20180209/0b6786c39409821386d9.css">
<link rel="stylesheet" href="//mcdn.xx.cn/tkproperty/prd/S20180209/26de14d649e499f9125c.css">
```

不参与打包的静态资源切换 cdn（如 static 下的 js）

```js
script: [
  {
    //直接更换域名
    src: "//mcdn.xx.cn/assets/public-js/lib/property/trace-record.js",
  },
  {
    src: "//mcdn.xx.cn/js/reference.js",
  },
];
```

## 三、自定义 html 模板

在项目根目录下新建 app.html，将 meta 和 rem.js 直接写到 head 中，保持原有{{HEAD}}和{{APP}}不动

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, initial-scale=1, maximun-scale=1, user-scalable=no, viewport-fit=cover"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="screen-orientation" content="portrait" />
    <meta name="full-screen" content="yes" />
    <meta name="browsermode" content="application" />
    <meta name="x5-orientation" content="portrait" />
    <meta name="x5-fullscreen" content="true" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <script>
      //插入rem.js
    </script>
    {{HEAD}}
  </head>
  <body>
    {{APP}}
  </body>
</html>
```

新建完成后，可以删除 nuxt.config.js 中 head 属性下静态 meta 和 icon 的配置

```js
head: {
  title: '产品名称',
  //删除静态meta设置，仅保留seo信息
  meta: [{
    hid: 'description',
    name: 'description',
    content: '描述内容'
  }],
  link: [],   //删除icon配置
  script: []  //正常引入外部js，删除原有 rem.js 引用
}
```

## 四、优化打包体积

如果项目安装了 nuxt-common 依赖，则去除重复打包依赖 bn.js 和加密库 crypto-js 只引入 AES 加密相关可以参照外部引入 vue、encrypt、vue-awesome-swiper 配置

按需引入 lodash 可以参照按需引入 vant 配置重要，使用 npm 包引入 node-rsa 会引入 es6，导致低版本浏览器加载异常，若不单独做 babel 处理，强烈推荐使用 cdn 引入 encrypt；在 IE 9 浏览器中可以模拟验证

查看打包体积需要依赖 webpack-bundle-analyzer 插件，nuxt 集成了该插件，在 nuxt.config.js 做如下配置：

```js
export default {
  build: {
    analyze: true,
  },
};
```

然后`npm run build --analyze`或`npm run build -a`，等待打包完毕后，在自动打开的网页中可以查看打包情况（或手动打开/.nuxt/stats/client.html）

**去除重复打包依赖 bn.js（废弃）**

多个库都依赖了 bn.js，会导致重复打包，nuxt.config.js 中加入如下配置：

```js
const path = require("path");
export default {
  mode: "universal",
  build: {
    extend(config) {
      //增加别名，指定bn.js路径
      config.resolve.alias["bn.js"] = path.resolve(
        process.cwd(),
        "node_modules",
        "bn.js"
      );
    },
  },
};
```

查看打包结果，如下左图为添加配置前，bn.js 被多次打包，添加配置后，只会打包一次依赖

**加密库 crypto-js 只引入 AES 加密相关（废弃）**

加密库 crypto-js 提供多种加密方式，项目中仅用到 AES 加密，在 api.js 中单独引入相关模块，代码如下：

```js
// import CryptoJS from 'crypto-js';
const CryptoJS = require("crypto-js/core.js");
//仅引入AES加密所需库
require("crypto-js/enc-base64.js");
require("crypto-js/md5.js");
require("crypto-js/mode-ecb.js");
require("crypto-js/pad-nopadding.js");
require("crypto-js/aes.js");
```

仅修改引入方式，加密代码不用做更改。

**按需引入 lodash（废弃）**

项目中多处引用 loadsh，直接使用引入会导致库文件整体打包，体积庞大。可以指定具体引用 js 文件按需加载，如：

```js
//直接引入会导致loadsh整体打包
//import {cloneDeep, debounce} from 'lodash';
//指定cloneDeep引入，具体文件目录可以在lodash源码中查看
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
```

如果项目中引入 loadsh 的地方过多，不好更改，可以使用 lodash-webpack-plugin 插件自动按需加载 lodash，配置方式如下：

```js
//需要安装依赖
//npm i lodash-webpack-plugin --save-dev
//npm i babel-plugin-lodash --save-dev
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
export default {
  mode: "universal",
  build: {
    extend(config) {
      config.plugins.unshift(new LodashModuleReplacementPlugin());
      config.module.rules[2].use[0].options.plugins = ["lodash"];
    },
  },
};
```

**外部引入 vue、encrypt、vue-awesome-swiper**

多个产品里面都用到相同版本的 vue、node-rsa、crypto-js、swiper。不通过外部引入会打包到项目文件中去，导致产品切换的时候都要重新下载一次这些公共文件。通过外部引入的方式，在第一个产品加载后，访问后面的产品就不需要再下

1.  配置 webpack externals

```js
{ build: {
    transpile: [/nuxt-common/],
    extend(config, {isClient}) {
      if(isClient){
        config.externals = {
          // 加密工具不打包
          ['./encrypt']: 'encrypt',
          ['nuxt-common/common/http/encrypt']: "encrypt",
        };
		//本地不使用cdn,runtime包不能使用vue-devtool
		if (process.env.PATH_TYPE != 'development') {
          config.externals['vue'] = 'Vue';
          config.externals['vuex'] = 'Vuex';
          config.externals['vue-router'] = 'VueRouter';
        }
      }
    },
}
```

2.  使用 nuxt-common/common/http/encrypt

```js
import { AESEncrypt, encryptData } from "nuxt-common/common/http/encrypt";
```

3.  配置外部引入 vue，encrypt

```js
{
  script: [
    {
      defer: true,
      src: "//mcdn.xx.cn/assets/public-js/common/http/encrypt.js",
    },
    {
      defer: true,
      src: "//mcdn.xx.cn/assets/public-js/lib/vue.all.runtime.js",
    },
  ];
}
```

4.  根据需要加载 vue-awesome-swiper

（1）使用 swiper 组件的方式可选加载方式

```js
/*
* plugins/main.js
*/
loadCss('/assets/public-js/lib/vue-awesome-swiper3.1.3.css');
loadJs('/assets/public-js/lib/vue-awesome-swiper3.1.3.js').then(() => {
    Vue.use(window.VueAwesomeSwiper);
});



/*
* 使用swiper的vue文件
*/
<template>
    <swiper v-show="confirmType == 'A'" ref="mySwiper" :options="swiperOptions">
        <swiper-slide class='swiper-slide' v-for="(item,index) in contents" :key="index" :class="{'single-slide': contents.length == 1, 'last-slide': index == contents.length - 1 && contents.length != 1}">
          <img class="content-tab-img" src="./img/icon-title.png"/>
          <div class="content">
            <div class="content-title">{{item.title}}</div>
            <div class="content-tips">{{item.tips}}</div>
            <div class='content-line' v-html="item.content"></div>
          </div>
          <span @click="confirmA(index)" class="content-confirm">知道了</span>
        </swiper-slide>
        <div slot="pagination" v-show="contents.length > 1" class="swiper-pagination"></div>
    </swiper>
</template>
<script>
export default {
 data() {
    return {
      activeIndex: 0,
      swiperOptions: {
        slidesPerView: "auto",
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        }
      }
    };
  },
  methods: {
	confirmA(index){
      //点击的不是最后一个
      if(this.contents.length > 1 && index != this.contents.length - 1){
        this.$refs.mySwiper.swiper.slideNext(300);
        setTimeout(() => {
          this.contents.splice(index, 1);
          this.sendCode('左侧弹窗关闭');
          this.$refs.mySwiper.swiper.updateSlides();
        }, 300)
      }else if(this.contents.length == 1 || index == this.contents.length - 1){
        //点击最后一个
        this.sendCode('右侧弹窗关闭');
        this.updateConfirmed(true);
        this.$emit('confirm');
      }
    },
  }
}
</script>
```

（2）使用 v-swiper 指令的方式使用 swiper（注意：一定要在使用 v-swiper 之前，执行 Vue.use(window.VueAwesomeSwiper)）

```js
/*
* nuxt.config.js
*/
{
 head: {
    link: [
      {
        rel: "stylesheet",
        href: `/assets/public-js/lib/vue-awesome-swiper3.1.3.css`
      }
    ],
    script: [
      {
        defer: true,
        src: '/assets/public-js/lib/vue-awesome-swiper3.1.3.ssr.js'
      },
    ]
  },
}




/*
* plugins/main.js
*/
if(!isServer()){
  Vue.use(window.VueAwesomeSwiper);
}


/*
* 使用swiper的vue文件
*/
<template>
    <div v-swiper:mySwiper="swiperOptions" v-show="claimCaseList.length > 0">
        <div class='swiper-wrapper'>
           <div class="swiper-slide" v-for="(item, index) in claimCaseList" :key="index">
              <img class="img-case" :src="item.src" />
           </div>
        </div>
    </div>
</template>
<script>
export default {
 data() {
    return {
      activeIndex: 0,
      swiperOptions: {
        slidesPerView: "auto",
        on: {
          slideChange: () => {
            this.sendTD({
              eventId: "prod_claimCaseSwitch"
            });
          }
        }
      },
    };
  }
}
</script>
```

**按需引入 vant、lodash**

项目中使用 vant，如果直接全量引入，会导致打包体积过大，可以使用 babel-plugin-import 实现按需引入，在 nuxt.config.js 中做如下配置：

```js
//加载babel-plugin-import依赖
//npm i babel-plugin-import --save-dev
//vant打包需要less依赖
//npm i less --save-dev
//npm i less-loader --save-dev
export default {
  mode: "universal",
  build: {
    transpile: [/vant.*?less/],
    babel: {
      plugins: [
        [
          "lodash",
          {
            libraryName: "lodash", //配置lodash按需加载
            libraryDirectory: "",
            camel2DashComponentName: false,
          },
          "lodash",
        ],
        [
          "import",
          {
            libraryName: "vant", //配置vant按需加载
            style: (name) => `${name}/style/less.js`,
          },
          "vant",
        ],
      ],
    },
  },
};
```

配置完成后，在项目中正常引入 vant 即可

```js
import Vue from "vue";
import { Button } from "vant";
Vue.use(Button);
//注意:配置按需加载后，不允许全量引入vant
//import Vant from 'vant';
//import 'vant/lib/index.css';
//Vue.use(vant);
```

## 五、首屏优化

**图片懒加载**

使用 vant 的核心依赖 vue-lazyload，实现组件懒加载：

```js
// plugins\plugin\main.js

import { Lazyload, Image as VantImage } from "vant";

Vue.use(Toast).use(Dialog).use(VantImage).use(Lazyload, {
  lazyComponent: true,
});
```

注册 Lazyload 可配置的其他常用参数：

-   lazyComponent: false // 开启后会在全局注册名为 lazy-component 的懒加载组件
-   preLoad: preLoad || 1.3, // 1.3 的距离是 还未展示的 dom 距离视口顶部的高度小于视口高度的 1.3 倍时就开始加载图片了
-   preLoadTop: preLoadTop || 0, // dom 的底部距离页面顶部多少距离还是加载
-   error: error || DEFAULT\_URL, // 加载失败显示的图片
-   loading: loading || DEFAULT\_URL, // 加载中显示的图片
-   attempt: attempt || 3, // 图片加载失败，最多重试的次数

**懒加载代码例子**

```js
<template>
  <div>
    <div class="detail">
      <img
        v-for="(item,index) in characterImages"
        :key="index"
        v-lazy="item.src"
        :class="`${videoImages.length > 0  ? 'swiper_img' : 'video_img'}`"
        @click="imageClick(item , $event)"
      />
    </div>
    <lazy-component>
      <productVideo />
    </lazy-component>
    <lazy-component>
      <div v-swiper:mySwiper="swiperOptions" class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in bannerImages" :key="index">
            <img v-lazy="item.src" alt />
          </div>
        </div>
      </div>
    </lazy-component>
    <div class="detail-features">
      <img v-for="(item,index) in featuresImages" :key="index"  v-lazy="item.src" />
    </div>
    <TkMask :show="showMask" @click="onHideMask" class="custom-dialog">
      <div class="custom-wrap">
        <div class="tk-helper"></div>
        <div class="content">
          <h3>{{custom.title}}</h3>
          <div v-html="custom.content"></div>
        </div>
      </div>
    </TkMask>
  </div>
</template>
```

**关于 谷歌浏览器勾选 disable cache 图片加载两次的问题（暂不用考虑，以下项目也有出现）**

-   v-lazy 官网 demo
-   vant 官网 懒加载 demo

**css 优先加载，JS 后置**

默认情况下，打包 css 和 js 都会位于 head 中，js 会减慢页面渲染速度，在 nuxt.config.js 中做如下配置：

```js
export default {
  mode: "universal",
  render: {
    //移除preload
    resourceHints: false,
    //将js移动到body中，添加defer标记
    asyncScripts: true,
  },
};
```

配置完成后，打包页面主体结构如下：

```html
<html lang="en" style="font-size: 50px;">
  <head>
    <title>产品标题</title>
    <link rel="stylesheet" href="/tkproperty/prd/S202006830/_nuxt/vendors/app.7508770.css">
    <link rel="stylesheet" href="/tkproperty/prd/S202006830/_nuxt/app.3f7b217.css">
    <link rel="stylesheet" href="/tkproperty/prd/S202006830/_nuxt/pages/index.3f90c5c.css">
  </head>
  <body>
    <script src="/tkproperty/prd/S202006830/_nuxt/cda622d.js" defer=""></script>
    <script src="/tkproperty/prd/S202006830/_nuxt/d0fb5d1.js" defer=""></script>
    <script src="/tkproperty/prd/S202006830/_nuxt/5dc59b2.js" defer=""></script>
    <script src="/tkproperty/prd/S202006830/_nuxt/2335657.js" defer=""></script>
    <script src="/tkproperty/prd/S202006830/_nuxt/23e2c42.js" defer=""></script>
    <script src="/tkproperty/prd/S202006830/_nuxt/c062255.js" defer=""></script>
  </body>
</html>
```

## 六、其他优化

**node-sass 更换为 sass**

主要 npm 包 替换：

```shell
# 移除 node-sass
npm remove node-sass -D


# 安装 最新版 sass
npm i sass -D
```

可选项移除：

```shell
# 移除 (项目中若用到，移除此 npm 包，接下来此组件将使用子模块的组件进行注册)
npm remove tk-radio -D

使用 子模块 nuxt-common\components\form\radio，并修改组件注册方式：
```js
// plugins\plugin\main.js


import Vue from "vue";
import { TkRadio, TkRadioGroup } from "@/nuxt-common/components/form/radio";
```

接下来搜索全局搜索 \\deep\\ 替换 为 ::v-deep。(注意：如果使用了 nuxt-common 子模块，不需要更改该子模块下的 \\deep)。  
最后重新启动项目，启动成功，则修改完毕！

The text was updated successfully, but these errors were encountered: