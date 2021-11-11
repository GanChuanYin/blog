const nav = require('./nav')

module.exports = {
  nav,
  sidebarDepth: 2,
  lastUpdated: '上次更新',
  searchMaxSuggestions: 10,
  // repo: 'coderlyu/au-blog',
  // docsDir: 'docs',
  // editLinks: true,
  // editLinkText: '编辑',
  sidebar: {
    mode: 'structuring',
    collapsable: false
  },
  rightMenuBar: true,
  pageButton: true,
  // bodyBgImg: (process.env.NODE_ENV === 'development' ? '' : '/blog') + '/images/bg-6.jpeg',
  // bodyBgImgOpacity: 0.8,
  footer: {
    createYear: 2021,
    copyrightInfo: 'coderly | <a href="https://github.com/coderlyu" target="_blank">MIT License</a>'
  },
  blogger: {
    avatar: 'https://avatar-static.segmentfault.com/249/884/2498845138-602fc45007b7c_big64',
    name: '刘誉',
    slogan: '总有人要赢，为什么不能是我',
  },
  author: {
    name: 'coderly',
    link: 'https://github.com/coderlyu',
  },
  social: {
    iconfontCssFile: '//at.alicdn.com/t/font_2382143_eetu51zaufa.css',
    icons: [
      {
        iconClass: 'iconshejiaotubiao-46',
        title: '知乎',
        link: 'https://www.zhihu.com/people/163200',
      },
      {
        iconClass: 'iconGitHub',
        title: 'GitHub',
        link: 'https://github.com/coderlyu',
      },
    ],
  },
}