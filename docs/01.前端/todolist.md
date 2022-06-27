JavaScript


Map和Set的区别，Map和Object的区别


数组的filter、every、flat的作用是什么

es6有哪些新特性

前端开发者不得不知的 ES6 十大特性

说一下对Promise的了解  Promise实现原理

Promise的all和race有什么区别


箭头函数和普通函数的区别


let、var和const的区别？如果希望const定义的对象的属性也不能被修改该怎么做？


堆和栈的区别

闭包的原理

instanceof的实现原理

new的实现原理

数据类型有哪些？如何判断一个数据是否是数组

JQuery实现链式调用的原理是什么

分别介绍一下原型、原型链、作用域和作用域链的含义和使用场景


CSS


css和js两种方式实现div右移1000px动画

visibility、display、opacity的区别



单行截断css


flex布局


flex：1


transition、transform、translate的区别


如何画一条 0.5px 的边框

怎么画一条0.5px的边（更新）



说一下BFC

浅析BFC原理及作用



parent元素宽高不定，实现scale固定宽高比始终为4：3


CSS垂直居中的方案

CSS垂直居中的12种实现方式



伪元素和伪类的区别

总结伪类与伪元素 | AlloyTeam



CSS position 属性
position的几个属性和含义


说一下盒模型


响应式布局方案

前端响应式布局原理与方案（详细版）

三栏式布局方案


如何提高动画的渲染性能

怎样使用GPU动画



框架通识


React-router、vue-router原理


vue和 react 的区别

前端框架用vue还是react？清晰对比两者差异

vue和 react 如何做技术选型


css module原理

<!-- ********************  ********************  ********************  ********************  ********************  ******************** -->

说一下虚拟DOM？为什么要使用虚拟DOM？

追问：虚拟DOM是如何合并patch的



map 和 v-for 中 key 的作用


react diff算法和vue diff算法的区别

【前端面试】面试官常问的虚拟dom，dom算法，key，别再答不出来了。
React 源码剖析系列 － 不可思议的 react diff



组件通信的方式有哪些


SPA单页面应用和多页面应用有什么区别


Vue


computed和watch的区别


data为什么是个函数，而不是对象


watch能监听computed的属性吗


vue的响应式原理


vue的生命周期


mounted拿到数据可以后可以直接获取dom吗


nextTick原理


vue模板（template）里为什么不能使用多个头结点？


vuex为什么同时设计mutation和action？只设计一个行不行？


vue2和 vue3 在数据绑定这一块有什么区别？


vue挂载和卸载父子组件生命周期钩子执行顺序


vue的优化方案（等同于如何编写可读性高、易维护且高性能的vue代码）

Vue 项目性能优化 — 实践指南（网上最全 / 详细）



keep-alive的原理，使用有什么问题？如何解决？


React


setState是同步还是异步的


fiber的实现原理

React Fiber 原理介绍



fiber的时间调度通过哪两个原生api实现的（requestAnimationFrame和requestIdleCallback？？？）


React合成事件是如何实现的


使用Redux时需要注意的点


如果Redux没返回新的数据会怎样


Redux是如何派发数据的？ connect原理？


什么场景会触发重新渲染（re-render）


setState返回一样的引用，render会执行吗


useEffect的使用方法？useEffect的return会在什么时候执行？useEffect原理是什么？

React Hooks 源码解析（4）：useEffect



useMemo和useCallback的区别，它们的实现原理是什么？


useEffect、useMemo、useCallback是如何做依赖收集的


React Hooks有什么优势和劣势


context的实现原理是什么？如何做依赖收集？


React的生命周期（React15、React16）


PureComponent和Component的区别


如果在map循环中没有设置key值，那么从 A B C D 四个节点变成 B C D三个节点，它会以什么样的方式变化


React dom绑定事件和原生事件有什么区别


类组件和纯函数组件的区别


Hooks的实现原理


Webpack


为什么webpack打包慢？为什么vite会比webpack快？如果想提高webpack速度，应该怎么做？

Webpack优化——将你的构建效率提速翻倍



说说webpack编译打包的流程


说一下对tree-shaking的了解，对CommonJS和ESM都可以用tree-shaking吗


webpack中plugin和laoder的区别，它们的执行时机，以及常用的plugin和loader


css-loader的作用是什么？不使用css-loader行不行


Typescript


Typescript相较于JavaScript有什么优势和劣势？


const func = (a, b) => a + b; 要求编写Typescript，要求a，b参数类型一致，都为number或者都为string


实现ReturnType


实现DeepReadOnly


基于已有类型生成新类型：剔除类型中的width属性
interface A {
  content: string;
  width: number;
  height: number;
}



浏览器 & 网络


介绍一下EventLoop

【前端体系】从一道面试题谈谈对EventLoop的理解



EventLoop中为什么要同时存在宏任务和微任务两个队列？设计一个行不行？一段代码在执行时，程序是如何去区分宏任务和微任务的？


内存泄露

一文带你了解如何排查内存泄漏导致的页面卡顿现象
项目中内存泄漏的场景
setTimeout为什么会造成内存泄露？如何防止setTimeout内存泄露？清除定时器为什么就不会有内存泄露？



介绍一下http缓存

追问：哪些字段用做强缓存？哪些字段用做协商缓存？
追问：cache-control、expires、etag等字段的属性值是什么样的？
追问：这些字段都被存放在请求的哪个部分？
追问：last-modify和expires这些字段的时间有什么区别？
追问：last-modify和expires能共存吗？
追问：如果不想让某个资源使用缓存，那么应该如何设计http缓存？
追问：cache-control中的no-cache和no-store的区别



介绍一下宏任务和微任务

【study】宏任务和微任务的区别是什么
追问：哪些是宏任务？哪些是微任务？
追问：宏任务和微任务的区别是什么？为什么要设计宏任务和微任务两个队列？使用一个任务队列行不行？为什么？
追问：你刚刚所说的都是根据api来识别微任务和宏任务的，那么一段完整的程序浏览器是如何区分宏任务和微任务的呢？



微任务的优先级


如何理解script标签是个宏任务


http1.1和http2的区别


onload 和 DOMContentLoaded的区别


requestAnimationFrame


浏览器加载页面的过程


script标签为什么要放在底部


defer和async的区别，以及它们的加载和执行时机


DOM事件模型。事件捕获和事件冒泡的使用场景

【前端 · 面试 】JavaScript 之你不一定会的基础题（一）



从输入url到页面展示的过程

从输入 URL 到页面展示到底发生了什么？看完吊打面试官！



如何设计css、js等文件的缓存


204、304、404、504


描述一下同源策略、跨域及其解决方案

前端常见跨域解决方案（全）
描述Jsonp具体的实现方案



xss和csrf的概念和防御方式

前端安全系列（一）：如何防止XSS攻击？
前端安全系列（二）：如何防止CSRF攻击？



sessionSorage、localstorage、cookie的区别？同一个系统开两个网页，两个网页的sessionStorage共享吗？


http和https的区别？为什么https是相对安全的？https加密原理？

为什么HTTPS是安全的，一张图告诉你



tcp三次握手和四次挥手的步骤


小程序


说说小程序的三层架构

微信小程序的架构以及为什么要用到双线程
拆分逻辑层和渲染层有什么优势和劣势



小程序框架和普通H5框架的区别（比如Taro和RN）


小程序在安卓和iOS上的区别


为什么要用Taro？Taro是如何实现跨端的？


Taro是如何兼容React和Vue的


Taro3和Taro2的区别


Taro的优化方案


小程序体积压缩的方案

京喜小程序首页瘦身实践——给小程序再减重30%的秘密



看代码说结果


EventLoop
setTimeout(function() {
	console.log(1);
}, 0);
new Promise(function executor(resolve) {
  	console.log(2);
  	for (var i = 0; i < 10000; i++) {
    		resolve();
  	}
  	console.log(3);
}).then(function() {
  	console.log(4);
});
console.log(5);



闭包。说结果，然后分别使用Promise和async改写成每隔1s打印1个数字的形式
function print(n){
    for(var i = 0;i <n;i++){
        setTimeout(console.log, 1000, i);
    }
}
print(10);



作用域
var a = 20;

function bar() {
  console.log(a);
}

function foo(fn) {
  var a = 10;
  fn();
}

foo(bar);



作用域
function bar() {
  var a = 20;
  return function() {
    console.log(a);
  }
}

var foo = bar();
var a = 10;
foo();  // 20



作用域
var a = 20;

function bar() {
  console.log(a)
  var a = 10;
  console.log(n)
}
bar()



EventLoop
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then((res) => {
  console.log(res);
})

promise.then(() => {
  console.log(3);
})

console.log(4)

setTimeout(() => {
  console.log(6)
})



EventLoop
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2 start');
}

console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

async1();

new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
}).then(function() {
  console.log('promise3');
});

console.log('script end');



原型链
function foo() {

}

const bar = new foo()

console.log(bar.__proto__)
console.log(bar.__proto__.__proto__)
console.log(bar.__proto__.__proto__.__proto__)
console.log(bar.__proto__.__proto__.__proto__.__proto__)
console.log(foo.prototype)
console.log(foo.prototype.prototype)
console.log(foo.prototype.prototype.prototype)



手撕代码 & 算法

手写快排
手写深拷贝
手写节流和防抖
手写call / apply
手写Promise.all / Promise.race / Promise.allSettled
手写限制并发数量
手写括号匹配
手写红包算法（注意均衡分配和浮点数计算精度问题）
数组去重
将奇数排在前面，偶数排在后面。要求时间复杂度O(n)。空间复杂度O(1)（不能用splice）
数组转树结构
解析出URL中所有的部分
实现一个compare函数，比较两个对象是否相同
螺旋矩阵
大数相加
找出出现次数最多的英语单词
节点倒序（将ul.id=list，将ul节点下的10000个li节点倒序。考虑性能。）
实现一个函数计算 "1+12-31+100-93"
判断链表是否有环
手写useReducer
手写useDidMount
手写useDidUpdate，模拟componentDidUpdate
手写usePrevious
爬楼梯
删除单向链表中的某个节点
柯里化
中划线转大写
千位分割
使用es5实现es6的let关键字

开放题


Antd栅格布局的实现


劫持所有的a标签，点击时不发生跳转，而是弹出提示框提示即将跳转到某个网址，点击确认则跳转，点击取消则无操作


两个promise，分别实现串行和并行形式，只有两个promise都返回结果时打印success，否则打印fail


长列表的优化方案有哪些？如何设计一个虚拟列表


埋点是如何拦截和上报的


如何实现一个无埋点数据上报


使用hash路由时，怎么能再刷新后时候自动滚动到页面上次的锚点位置？


做过哪些性能优化方面的工作


应用性能前端监控，字节跳动这些年经验都在这了


前端性能优化24条建议（2020）




实现一个多级菜单，菜单层级不定


如何监控和排查内存泄漏问题


模拟实现Java中的sleep函数


使用var模拟实现es6中的let和const


实现一个数组的splice方法（说思路）


A页面跳转到B页面，在B页面做的操作传输给A页面的方法


Sentry是如何实现错误监控的

解析Sentry源码(二)｜ Sentry如何处理错误数据
一篇讲透自研的前端错误监控



将一个GIF绘制到canvas上是否可行？如果可行，说说你的实现方法。


如果让你搭建一个项目，你会使用哪些技术方案进行组合？


如何做技术选型？

精读《12 个评估 JS 库你需要关心的事》



手写实现一个图片懒加载
1、到指定高度加载图片
2、考虑重排和重绘
3、考虑性能
4、先加载缩略图，再加载完整的图
5、注意图片加载容错情况


编写一个函数，传入一个promise和数字n，n(s)内promise没有返回结果，直接reject


了解SSR吗

谈谈我对服务端渲染(SSR)的理解



说一下深拷贝要注意的点


前端发展方向设想


如何设计一个类似于elementui这样的可以单包发布，也可以多包发布的框架


如果让你设计一个单测框架，你怎么设计？


如何实现模块懒加载？import语法是如何做的


如何设计一个单点登录方案？


用过哪些设计模式？分别说说它们的使用场景和应用案例？你觉得使用设计模式给你带来了什么好处？


从A页面跳转到B页面，再返回A页面时，如何让A页面保持上一次的状态


了解Vue3和React18吗


Nginx和node中间件代理的区别


Node中间件主要是解决什么问题


说一下你做过的最有收获的项目。描述一下系统所承载的功能、目标以及这个系统能解决什么问题？


你怎么看待Typescript中大量存在any的现象？面对这样的场景你将有什么样的想法和行动？
