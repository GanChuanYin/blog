---
title: docker
date: 2021-12-27 23:07:19
permalink: /pages/122e35/
categories:
  - 工具
tags:
  - 工具
---

记录部署 docker 应用时用到的命令

### 大纲

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/Docker-Commands-Diagram.png)

### 镜像

```shell

# 删除镜像
docker rmi <image id>

# 镜像重命名
docker tag <镜像 id> <名称>

# build 镜像 （项目根目录执行 预先配置好 Dockerfile）
docker build -t <镜像名> .

# run 镜像
docker run -d -p 4000:3000 <镜像名>
# >注意: 这里4000为宿主机的端口, 3000为docker内端口

# 保存镜像为tar包
docker save -o ./chatgpt-ui.tar chatgpt-ui:latest
```

### 容器

```shell
启动容器
docker start <容器 id>

关闭容器
docker stop <容器 id>

重启容器
docker restart <容器 id>

删除容器
docker rm <容器 id>

查看容器内部 IP
docker inspect --format '{{ .NetworkSettings.IPAddress }}' CONTAINER_ID
```

#### 查看容器日志

```shell

查看指定时间后的日志，只显示最后 100 行：
docker logs -f -t --since="2022-02-08" --tail=100 CONTAINER_ID

查看最近 30 分钟的日志:
docker logs --since 30m CONTAINER_ID

查看某时间之后的日志：
docker logs -t --since="2022-02-08T13:23:37" CONTAINER_ID

查看某时间段日志：
docker logs -t --since="2022-02-08T13:23:37" --until "2018-02-09T12:23:37" CONTAINER_ID
```

### 我的 node 项目 Dockerfile 文件配置项目

```shell
# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新
FROM node:latest

# 执行命令，创建文件夹
RUN mkdir -p /home/node-docker

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的文件夹下
COPY ./ /home/node-docker

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd到 /home/node-docker
WORKDIR /home/node-docker

# 安装项目依赖包
RUN npm install
# RUN npm run build

# 配置环境变量
ENV HOST 0.0.0.0
ENV PORT 3000

# 容器对外暴露的端口号
EXPOSE 3000

# 容器启动时执行的命令，类似npm run start 这里增加了一个production参数标识docker生产环境
CMD ["node", "/home/node-docker/index.js", "production"]

```
