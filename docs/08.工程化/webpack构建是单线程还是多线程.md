### 1. webpack 构建是单线程还是多线程?

webpack 构建是多线程的。Webpack 4 引入了一种全新的并行方式来构建代码块。

通过使用 `worker` 池，Webpack 可以将它的工作负载拆分成多个子进程，并行执行。

这种方法提高了构建速度，并最大程度地利用了计算机的硬件资源。

但是 **Webpack 的主线程仍然是单线程的**，在构建过程中只有一条流水线处理任务。

因此 Webpack 的多线程构建是基于 worker 的实现，而不是真正的多线程。

### 2. webpack 打包会默认使用多核吗？

**webpack 打包时默认会使用多个处理器核心来加快构建速度**。

webpack 内置了`thread-loader`插件，它会将部分任务分配给多个 worker 线程来处理，以提高构建性能。

它会根据配置的`worker`数量来分配线程任务，如果`worker`的数量配置得当可以明显减少构建时间。

除此之外，webpack 还提供其他多线程工具来提高构建效率，例如`HappyPack`、`parallel-webpack`等。

#### 2.1. 配置核心数

可以使用 webpack 中的`thread-loader`插件通过设置`worker`数量来配置打包的处理器核心个数。以下是一个简单的 webpack 配置示例，使用`babel-loader`和`thread-loader`在构建时启用多线程处理：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              // 设置 worker 数量，进行多线程处理
              workers: 2
            }
          },
          {
            loader: 'babel-loader',
            options: {
              // Babel 也可以使用多线程处理
              cacheDirectory: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
}
```

在这个示例中，设置了 2 个 worker 线程用于`babel-loader`进行编译工作，`thread-loader`将会将任务分配给这两个 worker 线程来加快构建速度。可以根据实际需要进行调整 worker 的数量。
