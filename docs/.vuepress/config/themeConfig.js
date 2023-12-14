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
    copyrightInfo: 'XingYun | <a href="https://github.com/GanChuanYin/blog" target="_blank">MIT License</a>'
  },
  blogger: {
    avatar: 'https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20211125145000.png',
    name: 'XingYun',
    slogan: '冲！',
  },
  author: {
    name: 'XingYun',
    link: 'https://github.com/GanChuanYin/blog',
  },
  social: {
    iconfontCssFile: '//at.alicdn.com/t/font_2382143_eetu51zaufa.css',
    icons: [
      // {
      //   iconClass: 'iconshejiaotubiao-46',
      //   title: '知乎',
      //   link: '',
      // },
      {
        iconClass: 'iconGitHub',
        title: 'GitHub',
        link: 'https://github.com/GanChuanYin/blog',
      },
    ],
  },
}