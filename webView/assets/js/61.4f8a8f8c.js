(window.webpackJsonp=window.webpackJsonp||[]).push([[61],{478:function(s,e,t){"use strict";t.r(e);var a=t(15),r=Object(a.a)({},(function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"github-actions-自动化部署"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#github-actions-自动化部署"}},[s._v("#")]),s._v(" GitHub Actions 自动化部署")]),s._v(" "),t("blockquote",[t("p",[s._v("参考："),t("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("GitHub Actions 入门教程"),t("OutboundLink")],1),t("br"),s._v("\n参考："),t("a",{attrs:{href:"https://docs.github.com/cn/actions/reference/events-that-trigger-workflows",target:"_blank",rel:"noopener noreferrer"}},[s._v("触发工作流程的事件"),t("OutboundLink")],1),t("br"),s._v("\n参考："),t("a",{attrs:{href:"https://docs.github.com/cn/github/authenticating-to-github/creating-a-personal-access-token",target:"_blank",rel:"noopener noreferrer"}},[s._v("创建个人访问令牌"),t("OutboundLink")],1)])]),s._v(" "),t("ul",[t("li",[s._v("持续集成，类似于 "),t("code",[s._v("Travis CI")])]),s._v(" "),t("li",[s._v("GitHub 只要发现 "),t("code",[s._v(".github/workflows")]),s._v(" 目录里面有 .yml 文件，就会自动运行该文件。")]),s._v(" "),t("li",[s._v("编写 .yml 文件，在工作流程中触发的事件中执行相应代码")])]),s._v(" "),t("h2",{attrs:{id:"创建最小权限用户"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#创建最小权限用户"}},[s._v("#")]),s._v(" 创建最小权限用户")]),s._v(" "),t("blockquote",[t("p",[s._v("只想新建的用户仅对一个文件夹进行读写操作(不开放其它权限)"),t("br"),s._v("\n只需要创建一个最小权限的角色"),t("br"),s._v("\n并仅给其分配单个文件夹的权限"),t("br"),s._v("\n可以防止权限过高造成安全隐患")])]),s._v(" "),t("ul",[t("li",[s._v("Xshell 连接服务器")]),s._v(" "),t("li",[t("code",[s._v("su")]),s._v(" 命令用来切换用户角色")]),s._v(" "),t("li",[s._v("切换到 root 用户角色："),t("code",[s._v("su root")]),s._v("，可能需要输入密码")]),s._v(" "),t("li",[s._v("创建用户："),t("code",[s._v("useradd [username]")]),s._v(", 以创建 au 角色为例("),t("code",[s._v("useradd au")]),s._v(")，此时创建的 "),t("code",[s._v("au")]),s._v(" 用户 默认使用 "),t("code",[s._v("au")]),s._v(" 用户组")]),s._v(" "),t("li",[s._v("使用 setfacl 设置文件权限： "),t("code",[s._v("setfacl -m u:[username]:rwx [dirname]")]),s._v("，例如："),t("code",[s._v("setfacl -m u:au:rwx /usr/web/html/blog")]),s._v("（给 au 角色设置 blog 文件的读写执行权限）")]),s._v(" "),t("li",[s._v("此时创建的用户仅有 "),t("code",[s._v("/usr/web/html/blog")]),s._v(" 文件的读写执行权限")])]),s._v(" "),t("h2",{attrs:{id:"创建-ssh-key"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#创建-ssh-key"}},[s._v("#")]),s._v(" 创建 SSH-KEY")]),s._v(" "),t("ul",[t("li",[s._v("切换到 "),t("code",[s._v("au")]),s._v(" 角色："),t("code",[s._v("su au")]),s._v("，直接使用最小权限用户生成 SSH-KEY")]),s._v(" "),t("li",[s._v("查看是否已经存在："),t("code",[s._v("ls -al ~/.ssh")])]),s._v(" "),t("li",[s._v("生成新的 ssh key："),t("code",[s._v("ssh-keygen -t rsa")]),s._v(", 连续三次回车")]),s._v(" "),t("li",[s._v("检测是否生成成功："),t("code",[s._v("ls -al ~/.ssh")])])]),s._v(" "),t("h3",{attrs:{id:"修改-id-rsa-pub-名称"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改-id-rsa-pub-名称"}},[s._v("#")]),s._v(" 修改 id_rsa.pub 名称")]),s._v(" "),t("ul",[t("li",[s._v("通过 au 角色创建好 ssh-key 后，公钥和私钥一般在 "),t("code",[s._v("/home/au/.ssh")]),s._v(" 目录下")]),s._v(" "),t("li",[s._v("切换到 .ssh 目录："),t("code",[s._v("cd /home/au/.ssh")])]),s._v(" "),t("li",[s._v("名字改为 authorized_keys："),t("code",[s._v("cat id_rsa.pub >> authorized_keys")])]),s._v(" "),t("li",[s._v("删除 id_rsa.pub："),t("code",[s._v("rm id_rsa.pub")])])]),s._v(" "),t("h2",{attrs:{id:"tar-命令"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#tar-命令"}},[s._v("#")]),s._v(" tar 命令")]),s._v(" "),t("ul",[t("li",[s._v("压缩: "),t("code",[s._v("tar -czvf blog.tgz ./*")])]),s._v(" "),t("li",[s._v("解压："),t("code",[s._v("tar xzvf blog.tgz")])])]),s._v(" "),t("h2",{attrs:{id:"编写-ci-yml"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#编写-ci-yml"}},[s._v("#")]),s._v(" 编写 "),t("code",[s._v("ci.yml")])]),s._v(" "),t("blockquote",[t("p",[t("a",{attrs:{href:"https://blog.csdn.net/qq_35374262/article/details/108127204",target:"_blank",rel:"noopener noreferrer"}},[s._v("参考文章"),t("OutboundLink")],1),t("br"),s._v(" "),t("a",{attrs:{href:"https://github.com/marketplace/actions/ssh-deploy",target:"_blank",rel:"noopener noreferrer"}},[s._v("ssh-deploy"),t("OutboundLink")],1)])]),s._v(" "),t("ol",[t("li",[s._v("KEY：上一步服务器新建的公钥"),t("code",[s._v("id_rsa.pub")]),s._v("，"),t("code",[s._v("cat id_rsa.pub")]),s._v(" 之后复制全部内容")]),s._v(" "),t("li",[s._v("HOST：服务器 ip")]),s._v(" "),t("li",[s._v("PORT：ssh 的端口号，默认为 22")]),s._v(" "),t("li",[s._v("SOURCE："),t("code",[s._v("npm run build")]),s._v(" 之后打包的文件路径，"),t("strong",[s._v("相对地址")]),s._v("(我的是打包到 webView 文件夹)")]),s._v(" "),t("li",[s._v("TARGET：服务器上需要上传到的文件路径，"),t("strong",[s._v("绝对地址")]),s._v("(我的是上传到 /usr/web/html/blog 文件夹下)")]),s._v(" "),t("li",[s._v("登录 Github，找到你要添加 Actions 的代码仓库，依次填入上述信息")])]),s._v(" "),t("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/git-2.png",alt:"actions 设置图片"}}),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("div",{staticClass:"highlight-lines"},[t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("div",{staticClass:"highlighted"},[s._v(" ")]),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("div",{staticClass:"highlighted"},[s._v(" ")]),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br"),t("br")]),t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("name: Publish And Deploy Demo # 显示在 Github Actions 里面的名称\n\n# 监听 master 分支的 push 事件，执行 jobs 里面的内容\non:\n  push:\n    branches:\n      - master\n\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest # 运行环境，告诉它运行在什么环境\n    steps:\n      # 第一步：下载源码（CI/CD拉取代码到自己的本地）\n      - name: Checkout\n        uses: actions/checkout@master # 切换到 master 分支\n\n      # 第二步：添加node环境，不可缺失\n      - name: Setup Node.js environment\n        uses: actions/setup-node@v2\n\n      # 第三步：打包构建\n      - name: Build\n        run: npm install && npm run build\n\n      # 第四步：部署到服务器\n      - name: ssh deploy\n        uses: easingthemes/ssh-deploy@v2.1.6\n        env:\n          SSH_PRIVATE_KEY: ${{ secrets.KEY }}\n          REMOTE_HOST: ${{ secrets.HOST }}\n          REMOTE_USER: ${{ secrets.USERNAME }}\n          REMOTE_PORT: ${{ secrets.PORT }}\n          SOURCE: 'webView/'\n          TARGET: '/usr/web/html/blog'\n")])]),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br")])]),t("p",[s._v("将代码推到 Github 仓库，就会触发自定义的 workflow"),t("br"),s._v("\n并将打包好的代码部署到服务器")]),s._v(" "),t("img",{attrs:{src:"https://raw.githubusercontent.com/coderlyu/au-blog/master/docs/.vuepress/public/images/blogs/git-3.png",alt:"actions 成功图片"}})])}),[],!1,null,null,null);e.default=r.exports}}]);