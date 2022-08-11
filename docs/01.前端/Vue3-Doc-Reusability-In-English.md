---
title: Vue3-Doc-Reusability-In-English
date: 2022-07-14 10:12:54
permalink: /pages/c2200e/
categories:
  - 前端
tags:
  - 
---
> The way to learn something well is to read the official documentation

## 1. Composables

### 1.1 What is a "Composable"?

In the context of Vue applications, a "composable" is a function that leverages Vue Composition API to encapsulate and reuse stateful logic.

When building frontend applications, we often have the need to reuse logic for common tasks. For example, we may need to format dates in many places, so we extract a reusable function for that. This formatter function encapsulates stateless logic: it takes some input and immediately returns expected output. There are many libraries out there for reusing stateless logic - for example lodash and date-fns, which you may have heard of.

In comparison, stateful logic involves managing state that changes over time. A simple example would be tracking the current position of the mouse on a page. In real world scenarios, it could also be more complex logic such as touch gestures or connection status to a database.

### 1.2 Mouse Tracker Example

If we were to implement the mouse tracking functionality using Composition API directly inside a component, it would look like this:

```html
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

But what if we want to `reuse` the same logic in multiple components? We can `extract` the logic into an external file, as a composable function:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
```

And this is how it can be used in components:

```html
<script setup>
  import { useMouse } from './mouse.js'

  const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

As we can see, the core logic remains exactly the same - all we had to do was move it into an external function and return the state that should be exposed. Same as inside a component, you can use the full range of Composition API functions in composables. The same useMouse() functionality can now be used in any component.

<font color=#3498db size=4>`The cooler part about composables though, is that you can also nest them: one composable function can call one or more other composable functions`</font>. This enables us to compose complex logic using small, isolated units, similar to how we compose an entire application using components. In fact, this is why we decided to call the collection of APIs that make this pattern possible Composition API.

As an example, we can extract the logic of adding and cleaning up a DOM event listener into its own composable:

```javascript
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

And now our `useMouse()` can be simplified to:

```javascript
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

> Each component instance calling useMouse() will create its own copies of x and y state so they won't interfere with one another. If you want to manage shared state between components, read the State Management chapter.

### 1.3 Async State Example

The useMouse() composable doesn't take any arguments, so let's take a look at another example that makes use of one. When doing async data fetching, we often need to handle different states: loading, success, and error:

```html
<script setup>
  import { ref } from 'vue'

  const data = ref(null)
  const error = ref(null)

  fetch('...')
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

Again, it would be tedious to have to repeat this pattern in every component that needs to fetch data. Let's extract it into a composable:

```javascript
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Now in our component we can just do:

```html
<script setup>
  import { useFetch } from './fetch.js'

  const { data, error } = useFetch('...')
</script>
```

useFetch() takes a static URL string as input - so it performs the fetch only once and is then done. What if we want it to re-fetch whenever the URL changes? We can achieve that by also accepting refs as an argument:

```javascript
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { data, error }
}
```

This version of useFetch() now accepts both static URL strings and refs of URL strings. When it detects that the URL is a dynamic ref using isRef(), it sets up a reactive effect using watchEffect(). The effect will run immediately, and tracking the URL ref as a dependency in the process. Whenever the URL ref changes, the data will be reset and fetched again.

### 1.4 Conventions and Best Practices

### 1.4.1 Naming

It is a convention to name composable functions with camelCase names that start with "use".

### 1.4.2 Input Arguments

A composable can accept ref arguments even if it doesn't rely on it for reactivity. If you are writing a composable that may be used by other developers, it's a good idea to handle the case of input arguments being refs instead of raw values. The unref() utility function will come in handy for this purpose:

```typescript
import { unref } from 'vue'

function useFeature(maybeRef) {
  // if maybeRef is indeed a ref, its .value will be returned
  // otherwise, maybeRef is returned as-is
  const value = unref(maybeRef)
}
```

If your composable creates reactive effects when the input is a ref, make sure to either explicitly watch the ref with watch(), or call unref() inside a watchEffect() so that it is properly tracked.

### 1.4.3 Return Values

You have probably noticed that we have been exclusively using ref() instead of reactive() in composables. The recommended convention is to always return an object of refs from composables, so that it can be destructured in components while retaining reactivity:

```javascript
// x and y are refs
const { x, y } = useMouse()
```

Returning a reactive object from a composable will cause such destructures to lose the reactivity connection to the state inside the composable, while the refs will retain that connection.

If you prefer to use returned state from composables as object properties, you can wrap the returned object with reactive() so that the refs are unwrapped. For example:

```javascript
const mouse = reactive(useMouse())
// mouse.x is linked to original ref
console.log(mouse.x)
```

```html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### 1.4.4 Side Effects

It is OK to perform side effects (e.g. adding DOM event listeners or fetching data) in composables, but pay attention to the following rules:

If you are working on an application that utilizes Server-Side Rendering (SSR), make sure to perform DOM-specific side effects in post-mount lifecycle hooks, e.g. <font color=#dd0000 size=4>`onMounted(). These hooks are only called in the browser, so you can ensure code inside it has access to the DOM.`</font>

<font color=#dd0000 size=4>`Make sure to clean up side effects in onUnmounted()`</font>. For example, if a composable sets up a DOM event listener, it should remove that listener in onUnmounted() (as we have seen in the useMouse() example). It can also be a good idea to use a composable that automatically does this for you, like the useEventListener() example.

### 1.4.5 Usage Restrictions

Composables should only be called synchronously in `<script setup>` or the `setup()` hook. In some cases, you can also call them in lifecycle hooks like onMounted().

These are the contexts where Vue is able to determine the current active component instance. Access to an active component instance is necessary so that:

Lifecycle hooks can be registered to it.

Computed properties and watchers can be linked to it for disposal on component unmount.

TIP

> `<script setup>` is the only place where you can call composables after usage of await. The compiler automatically restores the active instance context after the async operation for you.

### 1.5 Extracting Composables for Code Organization

Composables can be extracted not only for reuse, but also for <font color=#3498db size=4>`code organization`</font>. As the complexity of your components grow, you may end up with components that are too large to navigate and reason about. Composition API gives you the full flexibility to organize your component code into smaller functions based on logical concerns:

```html
<script setup>
  import { useFeatureA } from './featureA.js'
  import { useFeatureB } from './featureB.js'
  import { useFeatureC } from './featureC.js'

  const { foo, bar } = useFeatureA()
  const { baz } = useFeatureB(foo)
  const { qux } = useFeatureC(baz)
</script>
```

To some extent, you can think of these extracted composables as component-scoped services that can talk to one another.

### 1.6 Comparisons with Other Techniques

### 1.6.1 vs. Mixins

Users coming from Vue 2 may be familiar with the mixins option, which also allows us to extract component logic into reusable units. There are three primary drawbacks to mixins:

1. Unclear source of properties: when using many mixins, it becomes unclear which instance property is injected by which mixin, making it difficult to trace the implementation and understand the component's behavior. This is also why we recommend using the refs + destructure pattern for composables: it makes the property source clear in consuming components.

2. Namespace collisions: multiple mixins from different authors can potentially register the same property keys, causing namespace collisions. With composables, you can rename the destructured variables if there are conflicting keys from different composables.

3. Implicit cross-mixin communication: multiple mixins that need to interact with one another have to rely on shared property keys, making them implicitly coupled. With composables, values returned from one composable can be passed into another as arguments, just like normal functions.

<font color=#dd0000 size=4>`For the above reasons, we no longer recommend using mixins in Vue 3. The feature is kept only for migration and familiarity reasons.`</font>

### 1.6.2 vs. Renderless Components

In the component slots chapter, we discussed the Renderless Component pattern based on scoped slots. We even implemented the same mouse tracking demo using renderless components.

The main advantage of composables over renderless components is that composables do not incur the extra component instance overhead. When used across an entire application, the amount of extra component instances created by the renderless component pattern can become a noticeable performance overhead.

<font color=#3498db size=4>`The recommendation is to use composables when reusing pure logic, and use components when reusing both logic and visual layout.`</font>

## 2. Custom Directives

In addition to the default set of directives shipped in core (like v-model or v-show), Vue also allows you to register your own custom directives.

We have introduced two forms of code reuse in Vue: components and composables. Components are the main building blocks, while <font color=#3498db size=4>`composables are focused on reusing stateful logic`</font> . Custom directives, on the other hand, are <font color=#3498db size=4>`mainly intended for reusing logic that involves low-level DOM access on plain elements.`</font>

A custom directive is defined as an object containing lifecycle hooks similar to those of a component. The hooks receive the element the directive is bound to. Here is an example of a directive that focuses an input when the element is inserted into the DOM by Vue:

```html
<script setup>
  // enables v-focus in templates
  const vFocus = {
    mounted: (el) => el.focus()
  }
</script>

<template>
  <input v-focus />
</template>
```

Assuming you haven't clicked elsewhere on the page, the input above should be auto-focused. This directive is more useful than the autofocus attribute because it works not just on page load - it also works when the element is dynamically inserted by Vue.

In `<script setup>`, any camelCase variable that starts with the v prefix can be used as a custom directive. In the example above, vFocus can be used in the template as v-focus.

It is also common to globally register custom directives at the `app level`:

```typescript
const app = createApp({})

// make v-focus usable in all components
app.directive('focus', {
  /* ... */
})
```

> Custom directives should only be used when the desired functionality can only be achieved via direct DOM manipulation. Prefer declarative templating using built-in directives such as v-bind when possible because they are more efficient and server-rendering friendly.

### 2.1 Directive Hooks

A directive definition object can provide several hook functions (all optional):

```typescript
const myDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode, prevVnode) {
    // see below for details on arguments
  },
  // called right before the element is inserted into the DOM.
  beforeMount() {},
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted() {},
  // called before the parent component is updated
  beforeUpdate() {},
  // called after the parent component and
  // all of its children have updated
  updated() {},
  // called before the parent component is unmounted
  beforeUnmount() {},
  // called when the parent component is unmounted
  unmounted() {}
}
```

Hook Arguments

Directive hooks are passed these arguments:

- el: the element the directive is bound to. This can be used to directly manipulate the DOM.

- binding: an object containing the following properties.

- value: The value passed to the directive. For example in v-my-directive="1 + 1", the value would be 2.

- oldValue: The previous value, only available in beforeUpdate and updated. It is available whether or not the value has changed.

- arg: The argument passed to the directive, if any. For example in v-my-directive:foo, the arg would be "foo".

- modifiers: An object containing modifiers, if any. For example in v-my-directive.foo.bar, the modifiers object would be { foo: true, bar: true }.

- instance: The instance of the component where the directive is used.

- dir: the directive definition object.

- vnode: the underlying VNode representing the bound element.

- prevNode: the VNode representing the bound element from the previous render. Only available in the beforeUpdate and updated hooks.

As an example, consider the following directive usage:

```html
<div v-example:foo.bar="baz"></div>
```

The binding argument would be an object in the shape of:

```javascript
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /_ value of `baz` _/,
  oldValue: /_ value of `baz` from previous update _/
}
```

Similar to built-in directives, custom directive arguments can be dynamic. For example:

```html
<div v-example:[arg]="value"></div>
```

Here the directive argument will be reactively updated based on arg property in our component state.

> Apart from el, you should treat these arguments as read-only and never modify them. If you need to share information across hooks, it is recommended to do so through element's dataset.

### 2.3 Function Shorthand

It's common for a custom directive to have the same behavior for `mounted` and `updated`, with no need for the other hooks. In such cases we can define the directive as a function:

```html
<div v-color="color"></div>
```

```typescript
app.directive('color', (el, binding) => {
  // this will be called for both `mounted` and `updated`
  el.style.color = binding.value
})
```

### 2.4 Object Literals

If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression.

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```typescript
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

### 2.5 Usage on Components

When used on components, custom directives will always apply to a component's root node, similar to Fallthrough Attributes.

```html
<MyComponent v-demo="test" />
<!-- template of MyComponent -->

<div>
  <!-- v-demo directive will be applied here -->
  <span>My component content</span>
</div>
```

Note that components can potentially have more than one root node. `When applied to a multi-root component, a directive will be ignored and a warning will be thrown`. Unlike attributes, directives can't be passed to a different element with `v-bind="$attrs"`. In general, it is not recommended to use custom directives on components.

## 3. Plugins

### 3.1 Introduction

Plugins are self-contained code that usually add <font color=#3498db size=4>`app-level`</font> functionality to Vue. This is how we install a plugin:

```typescript
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* optional options */
})
```

A plugin is defined as either an object that exposes an `install()` method, or simply a function that acts as the install function itself. The install function receives the app instance along with additional options passed to `app.use()`, if any:

```typescript
const myPlugin = {
  install(app, options) {
    // configure the app
  }
}
```

There is no strictly defined scope for a plugin, but common scenarios where plugins are useful include:

1. Register one or more global components or custom directives with `app.component()` and `app.directive()`.

2. Make a resource injectable throughout the app by calling `app.provide()`.

3. Add some global instance properties or methods by attaching them to `app.config.globalProperties`.

4. A library that needs to perform some `combination of the above` (e.g. vue-router).

### 3.2 Writing a Plugin

In order to better understand how to create your own Vue.js plugins, we will create a very simplified version of a plugin that displays `i18n` (short for Internationalization) strings.

Let's begin by setting up the plugin object. It is recommended to create it in a separate file and export it, as shown below to keep the logic contained and separate.

```typescript
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Plugin code goes here
  }
}
```

We want to make a function to translate keys available to the whole application, so we will expose it using `app.config.globalProperties`. This function will receive a dot-delimited key string, which we will use to look up the translated string in the user-provided options.

```typescript
// plugins/i18n.js
export default {
  install: (app, options) => {
    // inject a globally available $translate() method
    app.config.globalProperties.$translate = (key) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

The plugin expects users to pass in an object containing the translated keys via the options when they use the plugin, so it should be used like this:

```typescript
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Our `$translate` function will take a string such as greetings.hello, look inside the user provided configuration and return the translated value - in this case, `Bonjour!`:

```html
<h1>{{ $translate('greetings.hello') }}</h1>
```

> Use global properties scarcely, since it can quickly become confusing if too many global properties injected by different plugins are used throughout an app.

### 3.3 Provide / Inject with Plugins

Plugins also allow us to use `inject` to provide a function or attribute to the plugin's users. For example, we can allow the application to have access to the `options` parameter to be able to use the translations object.

```typescript
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  }
}
```

Plugin users will now be able to inject the plugin options into their components using the `i18n` key:

```html
<script setup>
  import { inject } from 'vue'

  const i18n = inject('i18n')

  console.log(i18n.greetings.hello)
</script>
```


