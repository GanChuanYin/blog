#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e
# 生成静态文件
npm run build

git add -A
git commit -m '更新blog'

git push origin master