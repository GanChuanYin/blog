---
title: Typescript配置环境
date: 2022-06-28 11:04:09
permalink: /pages/38c16c/
categories:
  - 前端
tags:
  - 
---
## 1. tsconfig.json

TypeScript 使用 tsconfig.json 文件作为其配置文件，当一个目录中存在 tsconfig.json 文件，则认为该目录为 TypeScript 项目的根目录。

通常 tsconfig.json 文件主要包含两部分内容：指定待编译文件和定义编译选项。

目前 tsconfig.json 文件有以下几个顶层属性：

- compileOnSave
- compilerOptions
- exclude
- extends
- files
- include
- references
- typeAcquisition

### 1.1 为什么使用 tsconfig.json

通常我们可以使用 tsc 命令来编译少量 TypeScript 文件：

```shell
/*
  参数介绍：
  --outFile // 编译后生成的文件名称
  --target  // 指定ECMAScript目标版本
  --module  // 指定生成哪个模块系统代码
  index.ts  // 源文件
*/
```

```shell
$ tsc --outFile leo.js --target es3 --module amd index.ts
```

但如果实际开发的项目，很少是只有单个文件，当我们需要编译整个项目时，就可以使用 tsconfig.json 文件，将需要使用到的配置都写进 tsconfig.json 文件，
这样就 <font color=#00dddd size=4>不用每次编译都手动输入配置，另外也方便团队协作开发。</font>

### 1.2 compilerOptions

常用配置

```json
{
  "compileOnSave": false, // 属性作用是设置保存文件的时候自动编译，但需要编译器支持。
  // ...
  "compilerOptions": {
    "strict": true, // 开启所有严格的类型检查
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "target": "ES5", // 目标语言的版本
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {
      // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "removeComments": true, // 删除注释
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量

    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "alwaysStrict": true, // 在代码中注入'use strict'
    "noImplicitAny": true, // 不允许隐式的any类型
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 不允许this有隐式的any类型
    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitReturns": true //每个分支都会有返回值
  }
}
```

### 1.3 exclude

exclude 属性作用是指定编译器需要排除的文件或文件夹。
默认排除 node_modules 文件夹下文件。

```json
{
  // ...
  "exclude": [
    "src/lib" // 排除 src 目录下的 lib 文件夹下的文件不会编译
  ]
}
```

和 include 属性一样，支持 glob 通配符：

- 匹配 0 或多个字符（不包括目录分隔符）
  ? 匹配一个任意字符（不包括目录分隔符）
  \*\*/ 递归匹配任意子目录

### 1.4 extends

extends 属性作用是引入其他配置文件，继承配置。
默认包含当前目录和子目录下所有 TypeScript 文件。

```json
{
  // ...
  // 把基础配置抽离成 tsconfig.base.json 文件，然后引入
  "extends": "./tsconfig.base.json"
}
```

### 1.5 files

files 属性作用是指定需要编译的单个文件列表。
默认包含当前目录和子目录下所有 TypeScript 文件。

```json
{
  // ...
  "files": [
    // 指定编译文件是 src 目录下的 leo.ts 文件
    "scr/leo.ts"
  ]
}
```

### 1.6. include

include 属性作用是指定编译需要编译的文件或目录。

```json
{
  // ...
  "include": [
    // "scr" // 会编译 src 目录下的所有文件，包括子目录
    // "scr/*" // 只会编译 scr 一级目录下的文件
    "scr/*/*" // 只会编译 scr 二级目录下的文件
  ]
}
```

### 1.7. references

references 属性作用是指定工程引用依赖。
在项目开发中，有时候我们为了方便将前端项目和后端 node 项目放在同一个目录下开发，两个项目依赖同一个配置文件和通用文件，但我们希望前后端项目进行灵活的分别打包，那么我们可以进行如下配置：

```json
{
  // ...
  "references": [
    // 指定依赖的工程
    { "path": "./common" }
  ]
}
```
