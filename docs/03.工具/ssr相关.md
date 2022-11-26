---
title: ssr相关
date: 2022-07-14 10:23:55
permalink: /pages/818d26/
categories:
  - 工具
tags:
  - 
---
## PAC 模式 (Proxy Auto Config)

Shadowsocks 使用 PAC 自动模式时，意思是代理自动配置，或智能分流代理，其通过一个包含代理规则列表的 pac 文件，来控制哪些 IP、域名的流量走代理，哪些直连，以达到智能分流代理上网的目的。

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220714105634.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220714111459.png)

### 常用规则说明

<font color=#3498db size=4>`* 标记`</font>

通配符。\*可以表示任何字符串，任何满足条件的都会走代理。 如：

```shell
*.example.com/*

```

表示：

- https://www.example.com
- https://image.example.com
- https://image.example.com/abcd

等，都会走代理。

<font color=#3498db size=4>`@@ 标记`</font>

例外规则，任何满足 @@后面规则的地址，都不会走代理。 如：

@@\*.example.com/\*
表示：

- https://www.example.com
- https://image.example.com
- https://image.example.com/abcd
  等，都不会走代理。

<font color=#3498db size=4>`|| 标记`</font>

只匹配域名的结尾。 如：

||example.com
表示：

- http://example.com/abcd

- https://example.com

- ftp://example.com

等，都会走代理。

<font color=#3498db size=4>`| 标记`</font>

匹配地址的开头和结尾。 如：

- |https://example.com

表示以 https://example.com 开头的地址会走代理。

example.com|
表示以 example.com 结尾的地址会走代理。

<font color=#3498db size=4>`! 标记`</font>

注释。 如：

- ! 这是一行注释
- ! ||example.com
- ! 后面的内容表示注释，以!开头的规则也会无效。

举个栗子：

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220714111914.png)

<font color=#dd0000 size=4>注意:</font>

> 每行 <font color=#dd0000 size=4>`只能写一条规则`</font> 。修改 PAC 规则后，需要将 shadowsocks <font color=#dd0000 size=4>`关闭后重新打开`</font>，才会生效。


