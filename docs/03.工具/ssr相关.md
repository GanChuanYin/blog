### PAC 模式自定义规则

```bash
! Put user rules line by line in this file.
! See https://adblockplus.org/en/filter-cheatsheet

! code
||.github.com
||.stackoverflow.com
||.mongodb.com^
||.chrome.google.com^
*vercel*
*milou*

! video
||.youtube.com
||.tiktok.com
*dandanzan*
*o8tv*


```

正常的文字

每行 <font color=#dd0000 size=4>`只能写一条规则`</font> 。修改 PAC 规则后，需要将 shadowsocks <font color=#dd0000 size=4>`关闭后重新打开`</font>，才会生效。
