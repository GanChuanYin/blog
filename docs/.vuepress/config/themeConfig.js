const nav = require('./nav')

module.exports = {
  nav,
  sidebarDepth: 2,
  lastUpdated: '上次更新',
  searchMaxSuggestions: 10,
  // repo: '',
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
    copyrightInfo: 'coderly | <a href="https://github.com/GanChuanYin/blog" target="_blank">MIT License</a>'
  },
  blogger: {
    avatar: 'https://avatars.githubusercontent.com/u/54427198?s=400&u=2f4464bfc1676f80ceb78b8e94f24b58c58aa09d&v=4',
    name: 'GCY',
    slogan: '勇敢波吉 不怕困难！',
  },
  author: {
    name: 'GCY',
    link: 'https://github.com/GanChuanYin/blog',
  },
  social: {
    iconfontCssFile: '//at.alicdn.com/t/font_2382143_eetu51zaufa.css',
    icons: [
      // {
      //   iconClass: 'iconshejiaotubiao-46',
      //   title: '知乎',
      //   link: 'https://www.zhihu.com/people/163200',
      // },
      {
        iconClass: 'iconGitHub',
        title: 'GitHub',
        link: 'https://github.com/GanChuanYin/blog',
      },
    ],
  },
}