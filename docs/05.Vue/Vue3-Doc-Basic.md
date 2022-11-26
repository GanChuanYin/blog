---
title: Vue3-Doc-Basic-In-English
date: 2022-06-30 09:51:07
permalink: /pages/27470c/
categories:
  - Vue
tags:
  -
---

> The way to learn something well is to read the official documentation

[Vue3 Doc](https://vuejs.org/guide/introduction.html)

## Essentials

### Composition API | Options API Which to Choose?

Both API styles are fully capable of covering common use cases. They are different interfaces powered by <font color=#00dddd size=4> the exact same underlying system</font> . In fact, <font color=#00dddd size=4> the Options API is implemented on top of the Composition API!</font> The fundamental concepts and knowledge about Vue are shared across the two styles.

The Options API is centered around the concept of a "component instance" (this as seen in the example), which typically aligns better with a class-based mental model for users coming from OOP language backgrounds. It is also more beginner-friendly by abstracting away the reactivity details and enforcing code organization via option groups.

The Composition API is centered around declaring reactive state variables directly in a function scope, and composing state from multiple functions together to handle complexity. It is more free-form, and requires understanding of how reactivity works in Vue to be used effectively. In return, <font color=#00dddd size=4>its flexibility enables more powerful patterns for organizing and reusing logic</font>.

### App Configurations

The application instance exposes a <font color=#00dddd size=4> .config object that allows us to configure a few app-level options</font> , for example defining an app-level error handler that captures errors from all descendent components:

```typescript
app.config.errorHandler = (err) => {
  /* handle error */
}
```

The application instance also provides a few methods for registering app-scoped assets. For example, registering a component:

```typescript
app.component('TodoDeleteButton', TodoDeleteButton)
```

This makes the TodoDeleteButton available for use anywhere in our app. We will discuss registration for components and other types of assets in later sections of the guide. You can also browse the full list of application instance APIs in its API reference.

<font color=#dd0000 size=4>Make sure to apply all app configurations before mounting the app!</font>

### Restricted Globals Access

Template expressions are sandboxed and only have access to a restricted list of globals. The list exposes commonly used built-in globals such as Math and Date.

Globals not explicitly included in the list, for example user-attached properties on window, will not be accessible in template expressions. You can, however, explicitly define additional globals for all Vue expressions by adding them to <font color=#00dddd size=4> app.config.globalProperties.</font>

### DOM Update Timing

When you mutate reactive state, the DOM is updated automatically. However, it should be noted that the DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" in the update cycle <font color=#00dddd size=4> to ensure that each component needs to update only once no matter how many state changes you have made</font> .

To wait for the DOM update to complete after a state change, you can use the nextTick() global API:

```typescript
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // access updated DOM
  })
}
```

### Reactive Proxy vs. Original

It is important to note that the returned value from reactive() is a Proxy of the original object, which is not equal to the original object:

```typescript
const raw = {}
const proxy = reactive(raw)

// proxy is NOT equal to the original.
console.log(proxy === raw) // false
```

### Reactive Proxy vs. Original

It is important to note that the returned value from reactive() is a Proxy of the original object, which is not equal to the original object:

```typescript
const raw = {}
const proxy = reactive(raw)

// proxy is NOT equal to the original.
console.log(proxy === raw) // false
```

Only the proxy is reactive - mutating the original object will not trigger updates. Therefore, the best practice when working with Vue's reactivity system is to exclusively use the proxied versions of your state.

To ensure consistent access to the proxy, calling reactive() on the same object always returns the same proxy, and calling reactive() on an existing proxy also returns that same proxy:

```typescript
// calling reactive() on the same object returns the same proxy
console.log(reactive(raw) === proxy) // true

// calling reactive() on a proxy returns itself
console.log(reactive(proxy) === proxy) // true
```

This rule applies to nested objects as well. Due to deep reactivity, nested objects inside a reactive object are also proxies:

```typescript
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitations of reactive()

The reactive() API has two limitations:

It only works for object types (objects, arrays, and collection types such as Map and Set). It cannot hold primitive types such as string, number or boolean.

Since Vue's reactivity tracking works over property access, we must always keep the same reference to the reactive object. This means we can't easily "replace" a reactive object because the reactivity connection to the first reference is lost:

```typescript
let state = reactive({ count: 0 })

// the above reference ({ count: 0 }) is no longer being tracked (reactivity connection is lost!)
state = reactive({ count: 1 })
```

It also means that when we assign or destructure a reactive object's property into local variables, or when we pass that property into a function, we will lose the reactivity connection:

```typescript
const state = reactive({ count: 0 })

// n is a local variable that is disconnected
// from state.count.
let n = state.count
// does not affect original state
n++

// count is also disconnected from state.count.
let { count } = state
// does not affect original state
count++

// the function receives a plain number and
// won't be able to track changes to state.count
callSomeFunction(state.count)
```

### Reactive Variables with ref()

To address the limitations of reactive(), Vue also provides a ref() function which allows us to create reactive "refs" that can hold any value type:

```typescript
import { ref } from 'vue'

const count = ref(0)
```

```typescript
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

Similar to properties on a reactive object, the .value property of a ref is reactive. In addition, when holding object types, ref automatically converts its .value with reactive().

<font color=#00dddd size=4>A ref containing an object value can reactively replace the entire object:</font>

```typescript
const objectRef = ref({ count: 0 })

// this works reactively
objectRef.value = { count: 1 }
```

Refs can also be passed into functions or destructured from plain objects without losing reactivity:

```typescript
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// the function receives a ref
// it needs to access the value via .value but it
// will retain the reactivity connection
callSomeFunction(obj.foo)

// still reactive
const { foo, bar } = obj
```

### Writable Computed

Computed properties are by default getter-only. If you attempt to assign a new value to a computed property, you will receive a runtime warning. In the rare cases where you need a "writable" computed property, you can create one by providing both a getter and a <font color=#00dddd size=4>setter</font> :

```html
<script setup>
  import { ref, computed } from 'vue'

  const firstName = ref('John')
  const lastName = ref('Doe')

  const fullName = computed({
    // getter
    get() {
      return firstName.value + ' ' + lastName.value
    },
    // setter
    set(newValue) {
      // Note: we are using destructuring assignment syntax here.
      ;[firstName.value, lastName.value] = newValue.split(' ')
    }
  })
</script>
```

Now when you run fullName.value = 'John Doe', the setter will be invoked and firstName and lastName will be updated accordingly.

> don't make async requests or mutate the DOM inside a computed getter!

### Class and Style Bindings

If your component has multiple root elements, you would need to define which element will receive this class. You can do this using the \$attrs component property:

<!-- MyComponent template using $attrs -->

```html
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
<MyComponent class="baz" />
```

Will render:

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220703171401.png)

### Maintaining State with key

When Vue is updating a list of elements rendered with v-for, by default it uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, <font color=#00dddd size=4>Vue will patch each element in-place and make sure it reflects what should be rendered at that particular index.</font>

<font color=#00dddd size=4>This default mode is efficient, but only suitable when your list render output does not rely on child component state or temporary DOM state (e.g. form input values).</font>

To give Vue a hint so that it can track each node's identity, and thus reuse and reorder existing elements, you need to provide a unique key attribute for each item:

```html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

### v-for with a Component

This section assumes knowledge of Components. Feel free to skip it and come back later.

You can directly use v-for on a component, like any normal element (don't forget to provide a key):

```html
<MyComponent v-for="item in items" :key="item.id" />
```

However, this won't automatically pass any data to the component, because components have isolated scopes of their own. In order to pass the iterated data into the component, we should also use props:

```html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

The reason for not automatically injecting item into the component is <font color=#00dddd size=4> because that makes the component tightly coupled to how v-for works</font> . Being explicit about where its data comes from makes the component reusable in other situations.

### Displaying Filtered/Sorted Results

Be careful with reverse() and sort() in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods:

```shell
- return numbers.reverse()
+ return [...numbers].reverse()
```

### Accessing Event Argument in Inline Handlers

Sometimes we also need to access the original DOM event in an inline handler. You can pass it into a method using the special \$event variable, or use an inline arrow function:

```html
<!-- using $event special variable -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- using inline arrow function -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

```typescript
function warn(message, event) {
  // now we have access to the native event
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

## Event Handling

### Key Modifiers

When listening for keyboard events, we often need to check for specific keys. Vue allows adding key modifiers for v-on or @ when listening for key events:

```html
<!-- only call `vm.submit()` when the `key` is `Enter` -->
<input @keyup.enter="submit" />
```

You can directly use any valid key names exposed via KeyboardEvent.key as modifiers by converting them to kebab-case.

```html
<input @keyup.page-down="onPageDown" />
```

In the above example, the handler will only be called if \$event.key is equal to 'PageDown'.

### Key Aliases

Vue provides aliases for the most commonly used keys:

- .enter
- .tab
- .delete (captures both "Delete" and "Backspace" keys)
- .esc
- .space
- .up
- .down
- .left
- .right

### System Modifier Keys

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- .ctrl
- .alt
- .shift
- .meta

> On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the Windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.

For example:

```html
<!-- Alt + Enter -->

<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

> Note that modifier keys are different from regular keys and when used with keyup events, they have to be pressed when the event is emitted. In other words, keyup.ctrl will only trigger if you release a key while holding down ctrl. It won't trigger if you release the ctrl key alone.

### .exact Modifier

The .exact modifier allows control of the exact combination of system modifiers needed to trigger an event.

```html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

### Mouse Button Modifiers

- .left
- .right
- .middle

These modifiers restrict the handler to events triggered by a specific mouse button.

## Form Input Bindings

When dealing with forms on the frontend, we often need to sync the state of form input elements with corresponding state in JavaScript. It can be cumbersome to manually wire up value bindings and change event listeners:

```html
<input :value="text" @input="event => text = event.target.value" />
```

The v-model directive helps us simplify the above to:

```html
<input v-model="text" />
```

In addition, v-model can be used on inputs of different types, \<textarea>, and \<select> elements. It automatically expands to different DOM property and event pairs based on the element it is used on:

- \<input> with text types and \<textarea> elements use value property and input event;
- <input type="checkbox"> and <input type="radio"> use checked property and change event;
- <select> use value as a prop and change as an event.

> v-model will ignore the initial value, checked or selected attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using reactivity APIs.

### Modifiers

**.lazy**

By default, v-model syncs the input with the data after each input event (with the exception of IME composition as stated above). You can add the lazy modifier to instead sync after change events:

```html
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" />
```

## Lifecycle Hooks

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/lifecycle.16e4c08e.png)

## Watchers

### Watch Source Types

watch's first argument can be different types of reactive "sources": it can be a ref (including computed refs), a reactive object, a getter function, or an array of multiple sources:

```typescript
const x = ref(0)
const y = ref(0)

// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Do note that you can't watch a property of a reactive object like this:

```typescript
const obj = reactive({ count: 0 })

// this won't work because we are passing a number to watch()
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

Instead, use a getter:

```typescript
// instead, use a getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

### Deep Watchers

<font color=#00dddd size=4>When you call watch() directly on a reactive object, it will implicitly create a deep watcher</font> - the callback will be triggered on all nested mutations:

```typescript
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // fires on nested property mutations
  // Note: `newValue` will be equal to `oldValue` here
  // because they both point to the same object!
})

obj.count++
```

This should be differentiated with a getter that returns a reactive object - in the latter case, the callback will only fire if the getter returns a different object:

```typescript
watch(
  () => state.someObject,
  () => {
    // fires only when state.someObject is replaced
  }
)
```

You can, however, force the second case into a deep watcher by explicitly using the deep option:

```typescript
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Note: `newValue` will be equal to `oldValue` here
    // _unless_ state.someObject has been replaced
  },
  { deep: true }
)
```

> Use with Caution Deep watch requires traversing all nested properties in the watched object, and can be expensive when used on large data structures. Use it only when necessary and beware of the performance implications.

### watchEffect()

watch() is lazy: the callback won't be called until the watched source has changed. But in some cases we may want the same callback logic to be run eagerly - for example, we may want to fetch some initial data, and then re-fetch the data whenever relevant state changes. We may find ourselves doing this:

```typescript
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// fetch immediately
fetchData()
// ...then watch for url change
watch(url, fetchData)
```

This can be simplified with watchEffect(). <font color=#00dddd size=4> watchEffect() allows us to perform a side effect immediately while automatically tracking the effect's reactive dependencies</font> . The above example can be rewritten as:

```typescript
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

Here, <font color=#00dddd size=4>the callback will run immediately</font> . During its execution, it will also automatically track url.value as a dependency (similar to computed properties). Whenever url.value changes, the callback will be run again.

> watchEffect only tracks dependencies during its synchronous execution. When using it with an async callback, only properties accessed before the first await tick will be tracked.

### watch vs. watchEffect

watch and watchEffect both allow us to reactively perform side effects. Their main difference is the way they track their reactive dependencies:

watch only tracks the explicitly watched source. It won't track anything accessed inside the callback. In addition, the callback only triggers when the source has actually changed. watch separates dependency tracking from the side effect, giving us <font color=#00dddd size=4> more precise control over when the callback should fire.</font>

watchEffect, on the other hand, combines dependency tracking and side effect into one phase. It automatically tracks every reactive property accessed during its synchronous execution. This is more convenient and typically results in terser code, but <font color=#00dddd size=4> makes its reactive dependencies less explicit.
</font>

### Callback Flush Timing

When you mutate reactive state, it may trigger both Vue component updates and watcher callbacks created by you.

By default, <font color=#00dddd size=4>user-created watcher callbacks are called before Vue component updates. This means if you attempt to access the DOM inside a watcher callback, the DOM will be in the state before Vue has applied any updates.</font>

If you want to access the DOM in a watcher callback after Vue has updated it, you need to specify the flush: 'post' option:

```typescript
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush watchEffect() also has a convenience alias, watchPostEffect():

```typescript
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  // executed after Vue updates
})
```

### Stopping a Watcher

Watchers declared synchronously inside setup() or \<script setup> are bound to the owner component instance, and will be automatically stopped when the owner component is unmounted. In most cases, you don't need to worry about stopping the watcher yourself.

The key here is that the watcher must be created synchronously: if the watcher is created in an async callback, it won't be bound to the owner component and must be stopped manually to avoid memory leaks. Here's an example:

```html
<script setup>
  import { watchEffect } from 'vue'

  // this one will be automatically stopped
  watchEffect(() => {})

  // ...this one will not!
  setTimeout(() => {
    watchEffect(() => {})
  }, 100)
</script>
```

To manually stop a watcher, use the returned handle function. This works for both watch and watchEffect:

```typescript
const unwatch = watchEffect(() => {})
// ...later, when no longer needed
unwatch()
```

Note that there should be very few cases where you need to create watchers asynchronously, and synchronous creation should be preferred whenever possible. If you need to wait for some async data, you can make your watch logic conditional instead:

```typescript
// data to be loaded asynchronously
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // do something when data is loaded
  }
})
```

## Template Refs

While Vue's declarative rendering model abstracts away most of the direct DOM operations for you, there may still be cases where we need direct access to the underlying DOM elements. To achieve this, we can use the special ref attribute:

```html
<input ref="input" />
```

ref is a special attribute, similar to the key attribute discussed in the v-for chapter. It allows us to obtain a direct reference to a specific DOM element or child component instance after it's mounted. This may be useful when you want to, for example,
<font color=#00dddd size=4> programmatically focus an input on component mount, or initialize a 3rd party library on an element.</font>

### Accessing the Refs

To obtain the reference with Composition API, <font color=#00dddd size=4>we need to declare a ref with the same name</font> :

```html
<script setup>
  import { ref, onMounted } from 'vue'

  // declare a ref to hold the element reference
  // the name must match template ref value
  const input = ref(null)

  onMounted(() => {
    input.value.focus()
  })
</script>

<template>
  <input ref="input" />
</template>
```

### Refs inside v-for

When ref is used inside v-for, the corresponding ref should contain an Array value, which will be populated with the elements after mount:

```html
<script setup>
  import { ref, onMounted } from 'vue'

  const list = ref([
    /* ... */
  ])

  const itemRefs = ref([])

  onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

> It should be noted that the ref array does not guarantee the same order as the source array.

### Ref on Component

ref can also be used on a child component. In this case the reference will be that of a component instance:

```html
<script setup>
  import { ref, onMounted } from 'vue'
  import Child from './Child.vue'

  const child = ref(null)

  onMounted(() => {
    // child.value will hold an instance of <Child />
  })
</script>

<template>
  <Child ref="child" />
</template>
```

If the child component is using Options API or not using \<script setup>, the referenced instance will be identical to the child component's this, which means the parent component will have full access to every property and method of the child component. This makes it easy to create tightly coupled implementation details between the parent and the child, so component refs should be only used when absolutely needed
in most cases, you should try to implement parent / child interactions using the standard props and emit interfaces first.

An exception here is that components using \<script setup> are private by default: a parent component referencing a child component using \<script setup> won't be able to access anything unless the child component chooses to expose a public interface using the defineExpose macro:

```html
<script setup>
  import { ref } from 'vue'

  const a = 1
  const b = ref(2)

  defineExpose({
    a,
    b
  })
</script>
```
