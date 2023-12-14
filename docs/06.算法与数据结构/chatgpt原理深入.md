### 什么是模型

人的大脑在识别事物时一般如下

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230529213433.png)

分为 3 步骤

1. `输入`： 看到或者听到事物
2. `处理`： 大脑处理输入的事物
3. `输出`： 判断出看到或听到的事物是什么

在这个过程中，大脑就是 `模型`

进一步抽象就是 输入 => 模型处理 => 输出

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230529213351.png)

研究模型就是研究 `盒子` 的实现

### 构建模型

最近十几年 AI 发展迅速，工程师探索过很多种不同的模型原理和结构，比如 Symbolic（符号推导）

最终模拟大脑运行的 `Neural Networks`( 神经网络 )成为主流。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230529213822.png)

### chartGPT 运行过程

chartGPT 是基于上下文预测的大型通用文字模型，它的原理很`简单`: 根据输入内容预测下一个`单词`，循环这个过程直到结束

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/testfig.gif)

看似越简单的工作原理，背后隐藏的技术越复杂

chartGPT 通过 `1750亿` 文本参数建模，这些参数来自互联网上的各种新闻，论坛，文库，论文等等。

这些参数是人类自然语言的融合， chatGPT 利用这些参数训练， 相当于是**对现实世界建模**

最终 chatGPT 表现惊人， 它几乎可以回答任何行业任何学科的问题

当大模型参数达到某个关键的规模阈值，就会出现 `涌现`。这种模型效果质的变化也被称为相变——整体行为的戏剧性变化，而这一变化是通过研究无法预见的。 **OpenAI 本身都不能解释这些 AI 涌现出的“思维”**，

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230529145001.png)


