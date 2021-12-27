const dayjs = require('dayjs')
module.exports = [
  'vuepress-plugin-baidu-autopush', // 百度自动推送
  [
    'vuepress-plugin-baidu-tongji', // 百度统计
    {
      hm: '0127fd7df37b0f6903bf4c50236f10f3',
    },
  ],
  '@vuepress/nprogress',
  [
    'vuepress-plugin-zooming', // 放大图片
    {
      selector: '.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
      options: {
        bgColor: 'rgba(0,0,0,0.6)',
      },
    },
  ],
  [
    'one-click-copy', // 复制
    {
      copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
      copyMessage: '复制成功',
      duration: 1000,
      showInMobile: false
    }
  ],
  // [
  //   'vuepress-plugin-comment', // 评论
  //   {
  //     choosen: 'gitalk',
  //     options: {
  //       clientID: '',
  //       clientSecret: '',
  //       repo: 'GCY-blog',
  //       owner: 'GCY',
  //       admin: ['GCY'],
  //       pagerDirection: 'last',
  //       id: '',
  //       title: '「评论」<%- frontmatter.title %>',
  //       labels: ['Gitalk', 'Comment'],
  //       body:
  //         '页面：<%- window.location.origin + (frontmatter.to.path || window.location.pathname || "") %>',
  //     },
  //   }
  // ],
  [
    '@vuepress/last-updated', // 时间显示格式
    {
      transformer: (timestamp, lang) => {
        return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
      }
    }
  ],
]