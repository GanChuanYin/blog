(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{475:function(s,n,e){"use strict";e.r(n);var l=e(15),t=Object(l.a)({},(function(){var s=this,n=s.$createElement,e=s._self._c||n;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h1",{attrs:{id:"centos7-安装-nginx"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#centos7-安装-nginx"}},[s._v("#")]),s._v(" CentOS7 安装 Nginx")]),s._v(" "),e("p",[s._v("记一次 CentOS7 安装 Nginx 过程")]),s._v(" "),e("ol",[e("li",[s._v("安装 gcc")])]),s._v(" "),e("ul",[e("li",[s._v("查看版本："),e("code",[s._v("gcc -v")])]),s._v(" "),e("li",[s._v("安装命令："),e("code",[s._v("yum -y install gcc")])])]),s._v(" "),e("ol",{attrs:{start:"2"}},[e("li",[s._v("安装 pcre、pcre-devel")])]),s._v(" "),e("p",[s._v("nginx 的 http 模块使用 pcre 来解析正则表达式")]),s._v(" "),e("ul",[e("li",[e("code",[s._v("yum install -y pcre pcre-devel")])])]),s._v(" "),e("ol",[e("li",[s._v("zlib 安装")])]),s._v(" "),e("ul",[e("li",[e("code",[s._v("yum install -y zlib zlib-devel")])])]),s._v(" "),e("ol",{attrs:{start:"4"}},[e("li",[s._v("安装 openssl")])]),s._v(" "),e("p",[s._v("web 安全通信的基石")]),s._v(" "),e("ul",[e("li",[e("code",[s._v("yum install -y openssl openssl-devel")])])]),s._v(" "),e("ol",[e("li",[s._v("安装 Nginx")])]),s._v(" "),e("blockquote",[e("p",[e("a",{attrs:{href:"https://nginx.org/en/download.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("查看 Nginx 版本"),e("OutboundLink")],1),e("br"),s._v("\n选择一个稳定版本")])]),s._v(" "),e("ul",[e("li",[s._v("切换到 /usr/local 目录："),e("code",[s._v("cd /usr/local")])]),s._v(" "),e("li",[e("code",[s._v("wget -c https://nginx.org/download/nginx-1.18.0.tar.gz")])]),s._v(" "),e("li",[s._v("解压："),e("code",[s._v("tar -zxvf nginx-1.18.0.tar.gz")])]),s._v(" "),e("li",[e("code",[s._v("cd nginx-1.18.0")])]),s._v(" "),e("li",[s._v("执行以下 3 个命令")])]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("# 使用默认配置\n./configure\n\n# 编译安装\nmake\nmake install\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br")])]),e("ul",[e("li",[e("p",[s._v("查找安装路径："),e("code",[s._v("whereis nginx")])]),s._v(" "),e("ul",[e("li",[s._v("默认都是这个路径 /usr/local/nginx")])])]),s._v(" "),e("li",[e("p",[s._v("切换到 nginx 安装目录 "),e("code",[s._v("cd /usr/local/nginx/sbin/")])])])]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./nginx     # 启动\n./nginx -s stop  # 停止，直接查找nginx进程id再使用kill命令强制杀掉进程\n./nginx -s quit  # 退出停止，等待nginx进程处理完任务再进行停止\n./nginx -s reload  # 重新加载配置文件，修改nginx.conf后使用该命令，新配置即可生效\n\n# 重启nginx，建议先停止，再启动\n./nginx -s stop\n./nginx\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br")])]),e("ul",[e("li",[s._v("查看 nginx 服务是否启动成功："),e("code",[s._v("ps -ef | grep nginx")])])]),s._v(" "),e("h4",{attrs:{id:"安装上传下载命令-rz-和-sz"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装上传下载命令-rz-和-sz"}},[s._v("#")]),s._v(" 安装上传下载命令 rz 和 sz")]),s._v(" "),e("p",[e("code",[s._v("yum install lrzsz -y")])]),s._v(" "),e("h4",{attrs:{id:"安装-unzip"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装-unzip"}},[s._v("#")]),s._v(" 安装 unzip")]),s._v(" "),e("p",[e("code",[s._v("yum install -y unzip zip")])]),s._v(" "),e("h2",{attrs:{id:"添加-ssl-证书"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#添加-ssl-证书"}},[s._v("#")]),s._v(" 添加 ssl 证书")]),s._v(" "),e("blockquote",[e("p",[s._v("以阿里云为例")])]),s._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://www.aliyun.com/product/security/markets/aliyun/product/cas",target:"_blank",rel:"noopener noreferrer"}},[s._v("阿里云免费购买地址"),e("OutboundLink")],1)]),s._v(" "),e("li",[s._v('点 "选购证书" 进入购买页面')])]),s._v(" "),e("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/centos-1.png",alt:"ssl图片"}}),s._v(" "),e("ul",[e("li",[s._v("进入"),e("a",{attrs:{href:"https://yundun.console.aliyun.com/?p=cas#/certExtend",target:"_blank",rel:"noopener noreferrer"}},[s._v("证书管理"),e("OutboundLink")],1),s._v("页面，选择下载 Nginx 版本")])]),s._v(" "),e("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/centos-2.png",alt:"ssl下载图片"}}),s._v(" "),e("ul",[e("li",[s._v("先关闭 Nginx： "),e("code",[s._v("/usr/local/nginx/sbin/nginx -s stop")])]),s._v(" "),e("li",[s._v("下载后将会得到 "),e("code",[s._v(".key")]),s._v(" 和 "),e("code",[s._v(".pem")]),s._v(" 两个文件，将证书上传到服务器 "),e("code",[s._v("/usr/local/nginx/conf/ssl")]),s._v(" 下(例子)"),e("br"),s._v("\nhttps 默认端口为 443，在 "),e("code",[s._v("server")]),s._v(" 添加如下内容")])]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("div",{staticClass:"highlight-lines"},[e("br"),e("br"),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("br"),e("br"),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("br"),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("br"),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("br"),e("br"),e("br"),e("br"),e("br"),e("br"),e("div",{staticClass:"highlighted"},[s._v(" ")]),e("br"),e("br"),e("br"),e("br")]),e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("server {\n      listen       80;\n      listen       443 ssl default;\n      server_name  localhost;\n\n      ssl_certificate      ./ssl/5393413_coderly.cn.pem; # 上传的 .pem 文件(相对路径或绝对路径)\n      ssl_certificate_key  ./ssl/5393413_coderly.cn.key; # 上传的 .key 文件(相对路径或绝对路径)\n\n      ssl_session_cache    shared:SSL:1m;\n      ssl_session_timeout  5m;\n\n      ssl_ciphers  HIGH:!aNULL:!MD5;\n      ssl_prefer_server_ciphers  on;\n\n      server_name  localhost;\n\n      #access_log  logs/host.access.log  main;\n\n      location / {\n          root   /usr/web/html/blog; # 选择你网站根目录\n          index  index.html index.htm;\n      }\n  }\n")])]),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br"),e("span",{staticClass:"line-number"},[s._v("9")]),e("br"),e("span",{staticClass:"line-number"},[s._v("10")]),e("br"),e("span",{staticClass:"line-number"},[s._v("11")]),e("br"),e("span",{staticClass:"line-number"},[s._v("12")]),e("br"),e("span",{staticClass:"line-number"},[s._v("13")]),e("br"),e("span",{staticClass:"line-number"},[s._v("14")]),e("br"),e("span",{staticClass:"line-number"},[s._v("15")]),e("br"),e("span",{staticClass:"line-number"},[s._v("16")]),e("br"),e("span",{staticClass:"line-number"},[s._v("17")]),e("br"),e("span",{staticClass:"line-number"},[s._v("18")]),e("br"),e("span",{staticClass:"line-number"},[s._v("19")]),e("br"),e("span",{staticClass:"line-number"},[s._v("20")]),e("br"),e("span",{staticClass:"line-number"},[s._v("21")]),e("br"),e("span",{staticClass:"line-number"},[s._v("22")]),e("br"),e("span",{staticClass:"line-number"},[s._v("23")]),e("br")])]),e("ul",[e("li",[s._v("重新启动 Nginx："),e("code",[s._v("/usr/local/nginx/sbin/nginx")])])]),s._v(" "),e("h3",{attrs:{id:"问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[s._v("#")]),s._v(" 问题")]),s._v(" "),e("ol",[e("li",[s._v('the "ssl" parameter requires ngx_http_ssl_module in /usr/local/nginx/conf/nginx.conf:37')])]),s._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),e("p",[s._v("nginx 缺少 http_ssl_module 模块，编译安装的时候带上–with-http_ssl_module 配置就行了")])]),s._v(" "),e("ul",[e("li",[s._v("执行命令："),e("code",[s._v("/usr/local/nginx/sbin/nginx -V")])])]),s._v(" "),e("div",{staticClass:"language-{4, 5} line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("nginx version: nginx/1.18.0\nbuilt by gcc 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC)\nconfigure arguments:\n# arguments 参数为空, 所以报错\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br")])]),e("ul",[e("li",[e("p",[s._v("优先关闭 nginx："),e("code",[s._v("/usr/local/nginx/sbin/nginx -s stop")])])]),s._v(" "),e("li",[e("p",[e("code",[s._v("cd nginx-1.18.0")])])]),s._v(" "),e("li",[e("p",[s._v("重新执行新配置信息"),e("br"),s._v(" "),e("code",[s._v("./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module")])])]),s._v(" "),e("li",[e("p",[e("code",[s._v("make")])])]),s._v(" "),e("li",[e("p",[s._v("重新启动："),e("code",[s._v("/usr/local/nginx/sbin/nginx")])])])]),s._v(" "),e("p",[e("strong",[s._v("如果上述操作之后还是报错")])]),s._v(" "),e("ul",[e("li",[s._v("备份 nginx 配置")]),s._v(" "),e("li",[s._v("删除 nginx")]),s._v(" "),e("li",[s._v("重新 安装")])])])}),[],!1,null,null,null);n.default=t.exports}}]);