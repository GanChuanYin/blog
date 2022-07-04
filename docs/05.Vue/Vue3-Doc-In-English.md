> The way to learn something well is to read the official documentation

[Vue3 Doc](https://vuejs.org/guide/introduction.html)

## Essentials

### Composition API | Options API Which to Choose?

Both API styles are fully capable of covering common use cases. They are different interfaces powered by <font color=#3498db> the exact same underlying system</font> . In fact, <font color=#3498db> the Options API is implemented on top of the Composition API!</font> The fundamental concepts and knowledge about Vue are shared across the two styles.

The Options API is centered around the concept of a "component instance" (this as seen in the example), which typically aligns better with a class-based mental model for users coming from OOP language backgrounds. It is also more beginner-friendly by abstracting away the reactivity details and enforcing code organization via option groups.

The Composition API is centered around declaring reactive state variables directly in a function scope, and composing state from multiple functions together to handle complexity. It is more free-form, and requires understanding of how reactivity works in Vue to be used effectively. In return, <font color=#3498db>its flexibility enables more powerful patterns for organizing and reusing logic</font>.

### App Configurations

The application instance exposes a <font color=#3498db> .config object that allows us to configure a few app-level options</font> , for example defining an app-level error handler that captures errors from all descendent components:

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

<font color=#e74c3c>Make sure to apply all app configurations before mounting the app!</font>

### Restricted Globals Access

Template expressions are sandboxed and only have access to a restricted list of globals. The list exposes commonly used built-in globals such as Math and Date.

Globals not explicitly included in the list, for example user-attached properties on window, will not be accessible in template expressions. You can, however, explicitly define additional globals for all Vue expressions by adding them to <font color=#3498db> app.config.globalProperties.</font>

### DOM Update Timing

When you mutate reactive state, the DOM is updated automatically. However, it should be noted that the DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" in the update cycle <font color=#3498db> to ensure that each component needs to update only once no matter how many state changes you have made</font> .

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

<font color=#3498db>A ref containing an object value can reactively replace the entire object:</font>

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

Computed properties are by default getter-only. If you attempt to assign a new value to a computed property, you will receive a runtime warning. In the rare cases where you need a "writable" computed property, you can create one by providing both a getter and a <font color=#3498db>setter</font> :

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
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>

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

![](https://qiniu.espe.work/blog/20220703171401.png)

### Maintaining State with key

When Vue is updating a list of elements rendered with v-for, by default it uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, <font color=#3498db>Vue will patch each element in-place and make sure it reflects what should be rendered at that particular index.</font>

<font color=#3498db>This default mode is efficient, but only suitable when your list render output does not rely on child component state or temporary DOM state (e.g. form input values).</font>

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

The reason for not automatically injecting item into the component is <font color=#3498db> because that makes the component tightly coupled to how v-for works</font> . Being explicit about where its data comes from makes the component reusable in other situations.

### Displaying Filtered/Sorted Results

Be careful with reverse() and sort() in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods:

```shell
- return numbers.reverse()
+ return [...numbers].reverse()
```

