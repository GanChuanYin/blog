> i18n（其来源是英文单词 `internationalization` 的首末字符 i 和 n，18 为中间的字符数）是“国际化”的简称

### Vue-i18n 简单 demo

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

const app = createApp(App)

const i18n = createI18n({
  locale: 'en', // 默认语言
  messages: {
    en: {
      welcome: 'Welcome to my app!',
      greeting: 'Hello, {name}!'
    },
    zh: {
      welcome: '欢迎访问我的应用！',
      greeting: '你好，{name}！'
    }
  }
})

app.use(i18n)

app.mount('#app')
```

```html
<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('greeting', { name: 'John' }) }}</p>
    <button @click="changeLanguage">Switch Language</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeLanguage() {
        const newLocale = this.$i18n.locale === 'en' ? 'zh' : 'en'
        this.$i18n.locale = newLocale
      }
    }
  }
</script>
```

在上面的代码中，使用 `$t` 方法来获取消息，它会根据当前语言自动切换返回对应的消息。

通过点击按钮来切换语言，改变`$i18n.locale` 的值来进行语言切换。

### Vue-i18n 设计思想

Vue-i18n 的核心思想之一就是通过**字符串映射来实现翻译和本地化**。它提供了一种将应用中的文本内容（如标签、提示消息等）与对应的翻译文本进行映射的机制。

在 Vue-i18n 中，我们将不同语言的翻译文本以键值对的形式进行组织，通常使用 JSON 格式进行存储。**每个文本内容对应一个唯一的键，根据用户选择的语言，通过查找对应的键值对，将原始文本转换为选定语言的翻译文本。** 就是这么简单

例如，对于一个多语言的应用中的一个按钮文本，我们可以使用以下方式进行字符串映射：

```json
{
  "en": {
    "buttonText": "Submit"
  },
  "zh-CN": {
    "buttonText": "提交"
  },
  "es": {
    "buttonText": "Enviar"
  }
}
```

在 Vue 组件中使用 Vue i18n 插件提供的指令或方法获取翻译文本：

```html
<template>
  <button>{{ $t('buttonText') }}</button>
</template>
```

当用户选择对应的语言时，Vue i18n 会根据用户选择的语言将键`buttonText`的翻译文本动态映射到按钮的文本内容上。

### Vue-i18n 的内部模拟实现

下面是一个简单的 demo 模拟实现

```javascript
// 创建MessageConverter类，用于处理消息转换
class MessageConverter {
  constructor(messages) {
    this.messages = messages
  }

  // 根据键和语言获取翻译文本
  translate(key, lang) {
    if (this.messages[lang] && this.messages[lang][key]) {
      return this.messages[lang][key]
    }
    return key
  }
}

// 创建Vue i18n插件
const VueI18n = {
  install(Vue, options = {}) {
    // 将翻译文本转换为Vue全局混入的方法
    Vue.mixin({
      methods: {
        $t(key) {
          const lang = this.$i18n._lang || options.defaultLang // 获取语言选择，默认为配置的默认语言
          return this.$i18n._converter.translate(key, lang)
        }
      }
    })

    // 在Vue原型上添加设置语言的方法
    Vue.prototype.$setLanguage = function (lang) {
      this.$i18n._lang = lang
    }

    // 创建Vue i18n实例
    const i18n = new Vue({
      data() {
        return {
          _lang: options.defaultLang, // 默认语言
          _converter: new MessageConverter(options.messages) // 消息转换器实例
        }
      }
    })

    // 添加实例方法，用于手动设置语言
    Vue.prototype.$i18n = i18n
  }
}

// 导出Vue i18n插件
export default VueI18n
```

### 旧项目国际化改造

某些 UI 库支持国际化, 例如 Element ant 等, 可以直接参考官网配置

但是项目中的硬编码就没法了, 得手动改造

有个插件可以帮助我们节省很多时间

#### i18n Ally 插件（VSCode）

这个插件可以通过配置，读取、更改语言包，并可以检测代码中的硬编码文本，快速的对其进行提取、更改

文档参考 https://github.com/lokalise/i18n-ally
