---
title: 认识docker
date: 2023-05-17 16:48:35
permalink: /pages/41f38a/
categories:
  - 工程化
tags:
  - 
---
### 1. docker 的用处

技术爆发时代，应用变得越来越强大，也越来越复杂。

docker 可以让应用程序在不同环境下运行更加容易和高效。它主要有以下几个用途：

1. 应用程序容器化：Docker 可以把应用程序和它的依赖项打包到一个容器中，使应用程序能够在不同的开发环境、测试环境和生产环境中运行。

2. 提供可移植性和可部署性：Docker 容器可以在任何支持 Docker 的平台上运行，从而允许开发和测试人员在其本地计算机上构建和测试容器，并在生产环境中部署它们。

3. 快速构建和发布应用程序： Docker 的容器化技术使部署应用程序更加容易和快速，并且可以在几秒钟内启动一个容器，缩短了部署时间。

4. 简化配置和管理： Docker 容器把应用程序和依赖项打包到一个容器内，每个容器都有自己的文件系统和网络接口，从而避免了应用程序之间的冲突和干扰。

5. 提高系统效率和性能： Docker 可以让应用程序在轻量级的容器中运行，每个容器都可以共享操作系统内核，这样就减少了系统资源的使用和提高了应用程序的性能。

总的来说，Docker 提供了一种更加有效和自动化的方法来管理和部署应用程序，从而简化了应用程序的开发和部署流程，并提高了系统效率和性能。

举个例子：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230517165735.png)

假设你是一个餐馆老板，你想要在不同的地方开分店，但每个地方的厨房设备、厨师和配料都不同。

这时，你可以使用 Docker 来容器化你的餐厅应用程序，包括你的菜单、厨房设备和配料等等。

然后，在不同的地方，`你可以使用 Docker 来快速创建一个餐厅容器，这样你就可以在不同的地方轻松地启动餐馆，并且保持菜单和所需的设备是一致的`。

由于 Docker 容器可以共享操作系统内核，这样就可以在不同的地方更轻松地进行部署，而不需要为每种不同的操作系统和特定的硬件（例如：32-bit 或 64-bit）创建不同的版本。

这样，你可以通过使用 Docker 容器来更加有效和自动化地管理和部署不同地方的餐馆，并提高餐馆系统的效率和性能。

### 2. 认识 docker

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230517170138.png)

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

Docker 技术的三大核心概念，分别是：镜像 Image、容器 Container、仓库 Repository。

#### 2.1. Docker 轻量级的原因？

相信你也会有这样的疑惑：为什么 Docker 启动快？如何做到和宿主机共享内核？

当我们请求 Docker 运行容器时，Docker 会在计算机上设置一个资源隔离的环境。然后将打包的应用程序和关联的文件复制到 Namespace 内的文件系统中，此时环境的配置就完成了。之后 Docker 会执行我们预先指定的命令，运行应用程序。

> 镜像不包含任何动态数据，其内容在构建之后也不会被改变。

#### 2.2. 核心概念

1.Build, Ship and Run（搭建、运输、运行）；

2.Build once, Run anywhere（一次搭建，处处运行）；

3.Docker 本身并不是容器，它是创建容器的工具，是应用容器引擎；

4.Docker 三大核心概念，分别是：镜像 Image，容器 Container、仓库 Repository；

5.Docker 技术使用 Linux 内核和内核功能（例如 Cgroups 和 namespaces）来分隔进程，以便各进程相互独立运行。

6.由于 Namespace 和 Cgroups 功能仅在 Linux 上可用，因此容器无法在其他操作系统上运行。那么 Docker 如何在 macOS 或 Windows 上运行？ Docker 实际上使用了一个技巧，并在非 Linux 操作系统上安装 Linux 虚拟机，然后在虚拟机内运行容器。

7.镜像是一个可执行包，其包含运行应用程序所需的代码、运行时、库、环境变量和配置文件，容器是镜像的运行时实例。

下面介绍一些 docker 最基本、最常见的操作

### 3. 操作镜像

删除镜像

```shell
docker rmi <image id>

镜像重命名
docker tag <镜像 id> <名称>

build 镜像 （项目根目录执行 预先配置好 Dockerfile）
docker build -t <镜像名> .

镜像打包
docker save -o node-server-template.tar <'imageid'>

run 镜像
docker run -d -p 3000:3000 <镜像名>
```

### 4. 操作容器

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

#### 4.1. 查看容器日志

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

### 5. 举个例子： node 项目 Dockerfile 文件配置项目

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

### 6. 总结

docker 的 logo 就很形象，一头载满集装箱的蓝鲸

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230517170138.png)

蓝鲸就是 docker，集中箱就是一个个镜像

从水面上看，你只能看到一堆堆集装箱（应用）， 看不见水下默默载着它们前进的蓝鲸（docker）

通过 docker 和镜像，你就能在代码的海洋里畅游， 简单方便高效的实现各种功能。
