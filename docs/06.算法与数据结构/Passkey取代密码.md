### 密码发展现状

互联网发展了 20 多年，所有环节都巨大改善，**只有密码除外**，还是 20 年前的用法。

更准确的说，它的用户体验比 20 年前更差了。密码的强度要求现在越来越高，一般不能少于 8 个字符，还要包括特殊符号。 记得最早的手机解锁密码是 4 位, 之后变成了 6 位.

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723141920.png)

另外，除了密码，通常还有其他验证（短信、图片识别、OTP 时间码等等）。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723141938.png)

即使变得越来越麻烦，依然不能杜绝密码被盗、被破解、被钓鱼的风险。

于是，很早就有人想到了，可以设计一套`通用机制`，让网站也去调用手机上面的硬件识别，从而彻底告别密码。

最近几年各大公司达成一致，设计出了一套密码的替代方案：`密钥登陆`，英文叫做 `Passkey`。

### Passkey 原理

具体来说，**Passkey 之所以不要密码，因为采用了密钥登录。网站不再保存用户密码，而是保存用户的公钥。登录时，用户必须用自己的私钥，解开公钥加密的随机数，从而确认身份**。

这也意味着，用户要自己保存私钥。这是很麻烦的事情，因此 **Passkey 协议的重点，就在于密钥的生成和保管彻底自动化**。

Passkey 要求用户必须配备一个"身份管理器"（通常由操作系统提供），这个"身份管理器"负责生成密钥，然后公钥交给网站保存，私钥由它自己保存。

等到用户登录网站，需要私钥证明自己身份时，网站就要向用户选定的"身份管理器"发出请求。这时，"身份管理器"就会调用操作系统的指纹识别或者人脸识别，要求用户完成验证。如果用户通过了，"身份管理器"就允许用户使用保存在里面的私钥。

### 趋势

2022 年 WWDC 大会，苹果宣布支持 Passkey。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142208.png)

2023 年 5 月，谷歌和微软同时宣布，全面接入 Passkey。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142309.png)

Github 已经接入

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723144131.png)

大厂们终于达成一致

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142331.png)

目前，**iOS 和安卓已经支持 Passkey，自带"身份管理器"，有些笔记本（比如 Macbook）也支持**。如果是台式机，没有任何识别设备，浏览器就会给出二维码或者蓝牙，让手机代为验证。

### 以 iOS 16 Passkeys 为例

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142801.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142815.png)

验证时序图

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230723142732.png)

再过一两年，等到这个协议的各种语言封装库和框架出台，它肯定会改变人们的密码习惯, 最后 `忘记密码` .
