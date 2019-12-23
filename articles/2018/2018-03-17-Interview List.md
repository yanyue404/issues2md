## 开始

> 总结前端求职面试中常问考点

自我介绍，补充：先说一下自己的技术栈...  
日期 ： 2018.12.23

## Html

-   渲染机制，`link`,`head`,`script`,`body`
    -   `<script defer="defer" src=""></script>` 可以放在 `head`中 异步加载
-   盒模型
    -   现在给定一个 width：200px的盒子，他的width，padding，border，margin都是怎样的
    -   box-zing
    -   当padding与margin值为百分比时，根据父元素的 width 计算
-   重绘与回流
    -   回流一定会引起重绘，重绘不一定引发回流
-   html5有哪些新特性
-   前端存储对比，cookie，sessionStorage，localstorage
-   html的标签分哪几种，列举一些

## Css

-   常用选择器
-   选择器权值
    -   \[a,b,c,d\] （内联,id，class，元素） !important是超体
-   媒体查询
-   预处理器用过吗？优点
-   清浮动,BFC
    -   [关于CSS-BFC深入理解](https://juejin.im/post/5909db2fda2f60005d2093db)
-   flex
    -   `flex-direction` 主轴方向
    -   `justify-content`
    -   `align-items`
    -   `flex-wrap`换行
-   水平居中垂直居中
    -   flex
    -   transform: translate(-50%, -50%)
    -   display:table-cell
-   动画属性，css3了解吗，主要用什么，animation，transition，translate，transform 这四个是干嘛的
-   rem布局原理，优缺点，其他布局？
-   移动端做过吗，适配问题。750px 的设计稿，你怎么做适配，给几种方案。
-   浏览器兼容性遇到哪些？
    -   [autoprefixer](https://github.com/postcss/autoprefixer)

## JS

-   'use strict' 是怎么解析的
-   闭包
-   作用域
-   js运行机制，Event-loop，宏任务与微任务
-   原型链(原型链，对象，构造函数之间的联系)
-   this以及 ES6 箭头函数中的this，如何改变this
-   设计模式(要求说出如何实现,应用,优缺点)
-   什么是函数柯里化？JS的API有哪些应用到了它？
-   解决跨域的，以及后续JSONP的原理和实现以及cors怎么设置
-   函数不定参
-   讲讲时间复杂度计算?
-   ES6怎么编译成ES5,css-loader原理,过程
    -   [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600) / [the-super-tiny-compiler-cn](https://github.com/starkwang/the-super-tiny-compiler-cn/blob/master/super-tiny-compiler-chinese.js)
-   异步回调问题，promise，Generater
-   es6新特性，你用过哪些？
-   数组的构造函数上提供了什么方法？不是说原型上有什么方法
-   ES6 的类和 ES5 的构造函数有什么区别？

## 框架类

-   单页面应用SEO优化 [https://www.zhihu.com/question/51949678](https://www.zhihu.com/question/51949678)
-   三大框架原理
-   react 的生命周期介绍一下
-   组件传值
-   怎么用数据流管理应用
-   webpack都是怎么用的
-   react 和 vue 有什么区别啊，特别注重考察个人的总结
    -   设计思路，原理
    -   组件化实现
    -   指令辅助与函数式
    -   技术选型角度
    -   生态圈
    -   渲染效率
    -   测试
    -   学习曲线，数据流

## 未分类

-   实现一个进度条加载，从0 到100
-   一个url从浏览器输入到解析经历了什么
-   怎么判断一个对象是 object，还是 array。用 Object.prototype.toString.call() 吧
-   http 协议的一些原理、报文、缓存方案
-   前端安全的认识
-   最近做的一个项目，其中的难点，过程。
-   中间件
-   node中间层
-   请解释单页应用是什么，如何使其对SEO友好。

## 优化

-   性能优化
-   自己做过的前端优化
-   webpack打包的优化
-   有没有什么优化的经验，方案。不局限于打包。
-   react的性能优化有没有了解过啊，你都是怎么做优化的。

## 手写

-   两栏三栏自适应布局
-   写一个检测数据类型的方法
-   深拷贝
-   快速排序
-   手写vue 或react组件
-   手写es5继承
-   函数节流与函数防抖
-   bind函数
-   手写一个设计模式

## 简历改进

-   mobx redux 的区别，从简历上挖掘出的点，去看你是否总结。  
    mobx 我做过简单的总结。
-   什么是函数式，跟面向对象有什么区别，因为我简历写了正在学习 fp。
-   你简历上说你看过 redux 的源码，简单说一下吧。  
    终于认可了我一次，说这个确实看过，能说出来。我有点尴尬了。
-   你说你读过 《深入浅出 nodejs》，那你在项目中用过 node 吗。
-   你用过 vue, react。你觉得他们有什么区别。
-   最近在看什么书
-   除了写blog，还有什么其他的，工作之外做的
-   怎么学习前端知识啊

## 思考

-   我学习快不快，什么是我特有的，别人学需要的成本大不大，我的优势在哪里？
-   继承除了面试问还有什么用？还有其他的一些`这有什么用？`
-   技术揭秘 上拉加载原理
-   英语 翻译 校对
-   redux源码，源码学习

#### 参考资料

-   [front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook/blob/master/Translations/Chinese/README.md)
-   [CS-Interview-Knowledge-Map](https://github.com/InterviewMap/CS-Interview-Knowledge-Map)
-   [sunyongjian/blog#32](https://github.com/sunyongjian/blog/issues/32)