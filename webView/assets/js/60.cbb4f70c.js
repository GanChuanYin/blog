(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{477:function(s,t,a){"use strict";a.r(t);var e=a(15),r=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"nginx-的使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nginx-的使用"}},[s._v("#")]),s._v(" Nginx 的使用")]),s._v(" "),a("h2",{attrs:{id:"配置文件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置文件"}},[s._v("#")]),s._v(" 配置文件")]),s._v(" "),a("h3",{attrs:{id:"全局块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#全局块"}},[s._v("#")]),s._v(" 全局块")]),s._v(" "),a("ul",[a("li",[s._v("从配置文件开始到 "),a("code",[s._v("events")]),s._v(" 块之间的内容，主要会设置一些影响 "),a("code",[s._v("nginx")]),s._v(" 服务器整体运行的配置指令")]),s._v(" "),a("li",[s._v("比如："),a("code",[s._v("worker_processes 1;")]),s._v(" "),a("code",[s._v("worker_processes")]),s._v(" 值越大，可以支持的并发处理量也越多")])]),s._v(" "),a("h3",{attrs:{id:"events-块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#events-块"}},[s._v("#")]),s._v(" "),a("code",[s._v("events")]),s._v(" 块")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("events")]),s._v(" 块涉及的指令主要影响 "),a("code",[s._v("nginx")]),s._v(" 服务器与用户的网络连接")]),s._v(" "),a("li",[s._v("比如 "),a("code",[s._v("worker_connections 1024;")]),s._v(" 支持的最大连接数")])]),s._v(" "),a("h3",{attrs:{id:"http-块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http-块"}},[s._v("#")]),s._v(" "),a("code",[s._v("http")]),s._v(" 块")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("nginx")]),s._v(" 服务器配置中最频繁的部分")]),s._v(" "),a("li",[a("code",[s._v("http")]),s._v(" 块也可以包含 "),a("code",[s._v("http全局块")]),s._v("、"),a("code",[s._v("server 块")])])]),s._v(" "),a("h4",{attrs:{id:"http全局块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http全局块"}},[s._v("#")]),s._v(" "),a("code",[s._v("http全局块")])]),s._v(" "),a("ul",[a("li",[a("code",[s._v("http")]),s._v(" 全局块配置的指令包括文件引入、"),a("code",[s._v("MIME-TYPE")]),s._v(" 定义、日志自定义、连接超时时间、单链接请求数上限等")])]),s._v(" "),a("h4",{attrs:{id:"server-块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#server-块"}},[s._v("#")]),s._v(" "),a("code",[s._v("server 块")])]),s._v(" "),a("ul",[a("li",[s._v("这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了节省互联网服务器硬件成本。")]),s._v(" "),a("li",[s._v("每个 "),a("code",[s._v("http")]),s._v(" 块可以包含多个 "),a("code",[s._v("server")]),s._v(" 块，而每个 "),a("code",[s._v("server")]),s._v(" 块就相当于一个虚拟主机。")]),s._v(" "),a("li",[s._v("而每个 "),a("code",[s._v("server")]),s._v(" 块也分为全局 "),a("code",[s._v("server")]),s._v(" 块，以及可以同时包含多个 "),a("code",[s._v("location")]),s._v(" 块")])]),s._v(" "),a("h5",{attrs:{id:"全局server块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#全局server块"}},[s._v("#")]),s._v(" "),a("code",[s._v("全局server块")])]),s._v(" "),a("ul",[a("li",[s._v("最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或 "),a("code",[s._v("IP")]),s._v(" 配置。")])]),s._v(" "),a("h5",{attrs:{id:"location-块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#location-块"}},[s._v("#")]),s._v(" "),a("code",[s._v("location 块")])]),s._v(" "),a("ul",[a("li",[s._v("一个 "),a("code",[s._v("server")]),s._v(" 块可以配置多个 "),a("code",[s._v("location")]),s._v(" 块")]),s._v(" "),a("li",[s._v("这块的主要作用是基于 "),a("code",[s._v("nginx")]),s._v(" 服务器接收到的请求字符串（例如 "),a("code",[s._v("server_name/uri-string")]),s._v("），对虚拟主机名称（也可以是 "),a("code",[s._v("IP")]),s._v(" 别名）之外的字符串（例如：前面的 "),a("code",[s._v("/uri-string")]),s._v("）进行匹配，对特定的请求进行处理。地址定向、数据缓存和应答控制等功能，还有许多第三方模块的配置也在这里进行。")])]),s._v(" "),a("h2",{attrs:{id:"反向代理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#反向代理"}},[s._v("#")]),s._v(" 反向代理")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("=")]),s._v("：用于不含正则表达式的 "),a("code",[s._v("uri")]),s._v(" 前，要求请求字符串与 "),a("code",[s._v("uri")]),s._v(" 严格匹配，如果匹配成功，就 停止继续向下搜索并立即处理该请求。")]),s._v(" "),a("li",[a("code",[s._v("~")]),s._v("：用于表示 "),a("code",[s._v("uri")]),s._v(" 包含正则表达式，并且区分大小写")]),s._v(" "),a("li",[a("code",[s._v("~*")]),s._v("：用于表示 "),a("code",[s._v("uri")]),s._v(" 包含正则表达式，并且不区分大小写")]),s._v(" "),a("li",[a("code",[s._v("^~")]),s._v("：用于不含正则表达式的 "),a("code",[s._v("uri")]),s._v(" 前，要求 "),a("code",[s._v("nginx")]),s._v(" 服务器找到表示 "),a("code",[s._v("uri")]),s._v(" 和请求字符串匹配度最高的 "),a("code",[s._v("location")]),s._v(" 后，立即使用此 "),a("code",[s._v("location")]),s._v(" 处理请求，而不再使用 "),a("code",[s._v("location")]),s._v(" 块中的正则 "),a("code",[s._v("uri")]),s._v(" 和请求字符串做匹配")])]),s._v(" "),a("p",[s._v("【注意】：如果 "),a("code",[s._v("uri")]),s._v(" 包含正则表达式，则必须要有 "),a("code",[s._v("~")]),s._v(" 或者 "),a("code",[s._v("~*")]),s._v(" 表示")]),s._v(" "),a("h2",{attrs:{id:"负载均衡"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#负载均衡"}},[s._v("#")]),s._v(" 负载均衡")]),s._v(" "),a("ul",[a("li",[s._v("增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器，也就是我们所说的负载均衡")]),s._v(" "),a("li",[s._v("在 "),a("code",[s._v("http")]),s._v(" 块中，添加下面的代码")])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("http "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    upstream upstream_name "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8001")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8002")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    server "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        listen "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server_name localhost"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        location "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            proxy_pass http"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" upstream_name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            root html\n            proxy_set_header Host $host"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            proxy_set_header "),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("X")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Real"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("IP")]),s._v(" $remote_addr"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            proxy_set_header "),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("X")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Forwarded"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("For $proxy_add_x_forwarded_for"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br")])]),a("h5",{attrs:{id:"nginx-分配服务器策略"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nginx-分配服务器策略"}},[s._v("#")]),s._v(" "),a("code",[s._v("nginx")]),s._v(" 分配服务器策略")]),s._v(" "),a("ol",[a("li",[s._v("轮询（默认）\n"),a("ul",[a("li",[s._v("每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 "),a("code",[s._v("down")]),s._v(" 掉，能自动剔除")])])]),s._v(" "),a("li",[a("code",[s._v("weight")]),s._v(" "),a("ul",[a("li",[s._v("weight 代表权重，默认为"),a("code",[s._v("1")]),s._v("，权重越高被分配的客户端越多")])])])]),s._v(" "),a("p",[s._v("指定轮询几率，"),a("code",[s._v("weight")]),s._v(" 和访问比率成正比，用于后端服务器性能不均的情况")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("div",{staticClass:"highlight-lines"},[a("br"),a("br"),a("div",{staticClass:"highlighted"},[s._v(" ")]),a("div",{staticClass:"highlighted"},[s._v(" ")]),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("http "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    upstream upstream_name "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8001")]),s._v(" weight"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 添加权重")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8002")]),s._v(" weight"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    server "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        listen "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server_name localhost"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        location "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            proxy_pass http"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" upstream_name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            root html\n            proxy_set_header Host $host"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            proxy_set_header "),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("X")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Real"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("IP")]),s._v(" $remote_addr"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            proxy_set_header "),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("X")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Forwarded"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("For $proxy_add_x_forwarded_for"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br")])]),a("ol",{attrs:{start:"3"}},[a("li",[a("code",[s._v("ip_hash")]),s._v(" "),a("ul",[a("li",[s._v("每个请求按范文 "),a("code",[s._v("ip")]),s._v(" 的 "),a("code",[s._v("hash")]),s._v(" 结果分配，这样每个访客固定访问一个后端服务器，可以解决 "),a("code",[s._v("session")]),s._v(" 的问题。")])])])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("div",{staticClass:"highlight-lines"},[a("br"),a("div",{staticClass:"highlighted"},[s._v(" ")]),a("br"),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("    upstream server_pool "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        ip_hash"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 直接添加ip_hash")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8001")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8002")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("ol",{attrs:{start:"4"}},[a("li",[a("code",[s._v("fair")]),s._v("（第三方）\n"),a("ul",[a("li",[s._v("按后端服务器的响应时间来分配请求，响应时间短的优先分配。")])])])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("div",{staticClass:"highlight-lines"},[a("br"),a("br"),a("br"),a("div",{staticClass:"highlighted"},[s._v(" ")]),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("    upstream server_pool "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8001")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v(".28")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8002")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        fair"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 直接添加ip_hash")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("h2",{attrs:{id:"动静分离"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#动静分离"}},[s._v("#")]),s._v(" 动静分离")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("nginx")]),s._v(" 动静分离简单来说就是把动态跟静态请求分开，不能理解成只是把动态页面和静态页面物理分离。")]),s._v(" "),a("li",[s._v("严格意义上说应该是动态请求跟静态请求分开，可以理解成使用"),a("code",[s._v("nginx")]),s._v("处理静态页面，"),a("code",[s._v("tomcat")]),s._v("处理动态页面。")]),s._v(" "),a("li",[s._v("动静分离从目前实现角度来讲大致分为两种")]),s._v(" "),a("li",[s._v("一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案")]),s._v(" "),a("li",[s._v("另一种方法就是动态跟静态文件混合在一起发布，通过 "),a("code",[s._v("nginx")]),s._v(" 来分开")]),s._v(" "),a("li",[s._v("通过 "),a("code",[s._v("location")]),s._v(" 指定不同的后缀名实现不同的请求转发")]),s._v(" "),a("li",[s._v("通过 "),a("code",[s._v("expires")]),s._v(" 参数设置，可以使浏览器缓存过期时间，减少与服务器之前的请求和流量")]),s._v(" "),a("li",[s._v("具体 "),a("code",[s._v("expires")]),s._v(" 定义：是给一个资源设定一个过期时间，也就是说无需去服务端验证，直接通过浏览器自身确定是否过期即可，所以不会产生额外的流量。")]),s._v(" "),a("li",[s._v("此种方法非常适合不经常变动的资源（如果经常更新的文件，不建议使用 "),a("code",[s._v("expires")]),s._v(" 来缓存）")]),s._v(" "),a("li",[s._v("我这里设置 "),a("code",[s._v("3d")]),s._v("，表示在这 "),a("code",[s._v("3")]),s._v(" 天之内访问这个 "),a("code",[s._v("URL")]),s._v("，发送一个请求，对比服务器该文件最后更新时间没有变化，则不会从服务器抓取，返回状态码"),a("code",[s._v("304")]),s._v("，如果有修改，则直接从服务器重新下载，返回状态码"),a("code",[s._v("200")])])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("http "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    server "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        listen "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server_name localhost"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        location "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("js"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 假设js存放在static文件夹中的 js 文件夹里")]),s._v("\n            root "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            index index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("html index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("htm"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n         location "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("images"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 假设图片存放在static文件夹中的 images文件夹里")]),s._v("\n            root "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            autoindex on"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 列出当前文件夹中的内容")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br")])]),a("h2",{attrs:{id:"nginx-配置高可用的集群"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nginx-配置高可用的集群"}},[s._v("#")]),s._v(" nginx 配置高可用的集群")]),s._v(" "),a("ul",[a("li",[s._v("需要两台 "),a("code",[s._v("nginx")]),s._v(" 服务器")]),s._v(" "),a("li",[s._v("需要 "),a("code",[s._v("keepalived")]),s._v(" （需要安装 "),a("code",[s._v("keepalived")]),s._v("）\n"),a("ul",[a("li",[a("code",[s._v("cd /usr")])]),s._v(" "),a("li",[a("code",[s._v("yum install keepalived -y")])])])]),s._v(" "),a("li",[s._v("需要虚拟 "),a("code",[s._v("ip")])])]),s._v(" "),a("h2",{attrs:{id:"原理解析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#原理解析"}},[s._v("#")]),s._v(" 原理解析")]),s._v(" "),a("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/nginx-1.png",alt:"图片"}}),s._v(" "),a("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/nginx-2.png",alt:"图片"}}),s._v(" "),a("h3",{attrs:{id:"master-workers-的机制的好处"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#master-workers-的机制的好处"}},[s._v("#")]),s._v(" "),a("code",[s._v("master-workers")]),s._v(" 的机制的好处")]),s._v(" "),a("ul",[a("li",[s._v("首先，对于每个 "),a("code",[s._v("worker")]),s._v(" 进程来说，独立的进程，不需要加锁，所以省掉了锁带来的开销")]),s._v(" "),a("li",[s._v("同时在编程以及问题查找时，也会方便很多。")]),s._v(" "),a("li",[s._v("其次，采用独立的进程，可以让互相之间不会影响，一个进程退出后，其它进程还在工作，服务不会中断，"),a("code",[s._v("master")]),s._v(" 进行则很快启动新的 "),a("code",[s._v("worker")]),s._v(" 进程")]),s._v(" "),a("li",[s._v("当然，"),a("code",[s._v("worker")]),s._v(" 进程的异常退出，肯定时程序有"),a("code",[s._v("bug")]),s._v("了，异常退出，会导致当前"),a("code",[s._v("worker")]),s._v("上的所有请求失败，不过不会影响到所有请求，所以降低了风险")]),s._v(" "),a("li",[s._v("可以使用 "),a("code",[s._v("nginx -s reload")]),s._v(" 热部署，利于"),a("code",[s._v("nginx")]),s._v("热部署操作")])]),s._v(" "),a("h3",{attrs:{id:"需要设置多个worker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#需要设置多个worker"}},[s._v("#")]),s._v(" 需要设置多个"),a("code",[s._v("worker")])]),s._v(" "),a("ul",[a("li",[a("code",[s._v("nginx")]),s._v("同"),a("code",[s._v("redis")]),s._v("类似都采用了"),a("code",[s._v("io")]),s._v("多路复用机制，每个"),a("code",[s._v("worker")]),s._v("都是一个独立的进程，但每个进程里只有一个主线程，通过异步非阻塞的方式来处理请求，即使是成千上万个请求也不在话下")]),s._v(" "),a("li",[s._v("每个 "),a("code",[s._v("worker")]),s._v(" 的进程可以把 "),a("code",[s._v("cpu")]),s._v(" 的性能发挥到极致")]),s._v(" "),a("li",[s._v("所以 "),a("code",[s._v("worker")]),s._v(" 数和服务器的 "),a("code",[s._v("cpu")]),s._v(" 数相等是最为适宜的")]),s._v(" "),a("li",[s._v("设少了会浪费 "),a("code",[s._v("cpu")]),s._v("，设多了会造成 "),a("code",[s._v("cpu")]),s._v(" 频繁切换上下文带来的消耗")])]),s._v(" "),a("h4",{attrs:{id:"设置-worker-数量"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#设置-worker-数量"}},[s._v("#")]),s._v(" 设置 "),a("code",[s._v("worker")]),s._v(" 数量")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("worker_processes "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n# work 绑定 "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cpu")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v(" work 绑定 "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("cpu"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nworker_cpu_affinity "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0001")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0010")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0100")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("h4",{attrs:{id:"连接数-worker-connection"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#连接数-worker-connection"}},[s._v("#")]),s._v(" 连接数 "),a("code",[s._v("worker_connection")])]),s._v(" "),a("ul",[a("li",[s._v("这个值表示每个 "),a("code",[s._v("worker")]),s._v(" 进程所能建立连接的最大值")]),s._v(" "),a("li",[s._v("所以，一个"),a("code",[s._v("nginx")]),s._v("能建立的最大连接数，应该是 "),a("code",[s._v("worker_connection * worker_processes")])]),s._v(" "),a("li",[s._v("当然，这里说的是最大连接数，对于"),a("code",[s._v("http")]),s._v("请求本地资源来说，能够支持的最大并发数量是 "),a("code",[s._v("worker_connection * worker_processes")])]),s._v(" "),a("li",[s._v("如果是支持"),a("code",[s._v("1.1")]),s._v("的浏览器每次访问要占两个连接，所以普通的静态访问最大并发数是："),a("code",[s._v("worker_connection * worker_processes / 2")])]),s._v(" "),a("li",[s._v("而如果是"),a("code",[s._v("http")]),s._v("作为反向代理来说，最大并发数量应该是"),a("code",[s._v("worker_connection * worker_processes / 4")])]),s._v(" "),a("li",[s._v("因为作为反向代理服务器，每个并发会建立与客户端的连接和与后端服务的连接，会占用两个连接。")])])])}),[],!1,null,null,null);t.default=r.exports}}]);