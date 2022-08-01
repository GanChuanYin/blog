---
title: shell脚本
date: 2022-07-26 21:31:17
permalink: /pages/08ca03/
categories:
  - 计算机
tags:
  - 
---
## 根据端口获得进程号 并 kill 掉进程

```shell
#!/bin/bash

#use sh kill.sh 8080

# echo "$0"
# port="$1"
# echo $port

##根据端口获得进程号
# lsof -i :$port | grep -i LISTEN | awk '{print $2}'
#
##组合获得该进程的执行命令
# lsof -i :$port | grep -i LISTEN | awk '{print $2}' | xargs -I {} ps -o command -p {} | tail -n +2
#

##管道给kill掉该进程
for i in 8080 4500 3000
do
    lsof -i :$i | grep -i LISTEN | awk '{print $2}' | xargs -I {} kill -15 {}
    echo $i
done
```
