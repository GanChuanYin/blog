const themeConfig = require('./config/themeConfig')
const markdown = require('./config/markdown')
const plugins = require('./config/plugins')
const head = require('./config/head')

module.exports = {
  theme: 'vdoing',
  title: "XingYun blog",
  description: '关于前端技术分享和学习的个人博客',
  dest: 'webView',
  cache: true,
  base: '/',
  category: true,
  markdown,
  plugins,
  head, 
  themeConfig,
  port:3000
}