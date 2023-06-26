## 1. 动态修改页面 title

每个子路由页的标题即可，在每个子路由对象中添加 meta 属性：

```shell
{
  path: '/todolist',
  name: 'todolist',
  component: Todolist,
  meta: { title: '每日待办' }
}
```

```javascript
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  next()
})

export default router
```

效果

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230625172104.png)

## 2. 路由鉴权

Vue Router 的权限验证通常可以通过全局前置守卫和路由元信息来实现。

首先，在创建 Vue Router 实例之前，你可以定义一个全局前置守卫函数，用于检查用户是否有权限访问某个路由。

```javascript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = // 在此处根据你的验证逻辑判断用户是否已登录
  if (requiresAuth && !isAuthenticated) {
    next('/login'); // 如果需要认证且用户未登录，则将用户重定向到登录页
  } else {
    next(); // 否则放行
  }
});
```

接下来，在定义路由时，你可以使用路由 meta 来标记需要进行权限验证的路由。

```javascript
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // 需要登录才能访问
  }
  // 其他路由定义
]
```

这样，在用户访问这些需要验证权限的路由时，会触发前置守卫函数，从而执行相应的权限验证逻辑。

## 3. 组件懒加载进度条

利用 NProgress 实现顶部加载进度条

```javascript
// 顶部路由加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 600, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

router.beforeEach((to: any, from: any, next: any) => {
  // 顶部进度条
  NProgress.start()
  if (!to.matched.length) {
    next({ name: 'NotFound' })
  }
})

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})
```

实现效果类似 YouTube 网站顶部 `红条`

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230316173037.png)

## 4. 路由重定向

与鉴权配合，如果用户无权限或者未登录，跳转到登录页面

```javascript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  // 在此处根据你的验证逻辑判断用户是否已登录
  const isAuthenticated = check()
  if (requiresAuth && !isAuthenticated) {
    next('/login') // 如果需要认证且用户未登录，则将用户重定向到登录页
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard') // 如果用户已经登录，并且访问的是登录页，则将用户重定向到主页或其他默认页面
  } else {
    next() // 否则放行
  }
})
```

如果用户已经登录（根据你的验证逻辑），并且访问的是登录页，则会将用户重定向到其他默认页面（如 /dashboard）。这样可以防止已经登录的用户再次进入登录页。
