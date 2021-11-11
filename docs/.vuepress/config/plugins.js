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
  [
    'vuepress-plugin-comment', // 评论
    {
      choosen: 'gitalk',
      options: {
        clientID: 'ee27cddb54c708e69312',
        clientSecret: '78700378974e4e0682b1d8c67b7c86ea6912d243',
        repo: 'au-blog',
        owner: 'coderlyu',
        admin: ['coderlyu'],
        pagerDirection: 'last',
        id: '<%- (frontmatter.permalink || frontmatter.to.path || "123456789012345").slice(-16) %>',
        title: '「评论」<%- frontmatter.title %>',
        labels: ['Gitalk', 'Comment'],
        body:
          '页面：<%- window.location.origin + (frontmatter.to.path || window.location.pathname || "123456789012345") %>',
      },
    }
  ],
  [
    '@vuepress/last-updated', // 时间显示格式
    {
      transformer: (timestamp, lang) => {
        return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
      }
    }
  ],
]