function createRoutesMap(routes, prefix = '') {
  return routes.reduce((pre, current) => {
    pre[prefix + current.path] = current.component
    if (current.children && current.children.length > 0) {
      pre = Object.assign(
        pre,
        createRoutesMap(current.children, prefix + current.path + '/')
      )
    }
    return pre
  }, {})
}

const routes = [
  {
    path: '/page1',
    name: 'page1-1',
    component: 'page1.vue',
    children: [
      {
        path: 'page1-1',
        name: 'page1-1',
        component: 'page1-1.vue'
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: 'page3.vue'
  }
]

console.log(createRoutesMap(routes))
