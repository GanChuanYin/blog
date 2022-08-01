---
title: Vue3-Extra-Topics
date: 2022-07-26 10:31:32
permalink: /pages/49b886/
categories:
  - Vue
tags:
  - 
---
## 1. Composition API FAQ

### 1.1 Why Composition API?

#### 1.1.1 Better Logic Reuse

The primary advantage of Composition API is that it enables clean, efficient logic reuse in the form of Composable functions. It solves all the `drawbacks` of mixins, the primary logic reuse mechanism for Options API.

Composition API's logic reuse capability has given rise to impressive community projects such as VueUse, an ever-growing collection of composable utilities. It also serves as a clean mechanism for easily integrating stateful third-party services or libraries into Vue's reactivity system, for example immutable data, state machines, and RxJS.

#### 1.1.2 More Flexible Code Organization

Many users love that we write organized code by default with Options API: everything has its place based on the option it falls under. However, Options API poses serious limitations when a single component's logic grows beyond a certain complexity threshold. This limitation is particularly prominent in components that need to deal with multiple logical concerns, which we have witnessed first hand in many production Vue 2 apps.

Take the folder explorer component from Vue CLI's GUI as an example: this component is responsible for the following logical concerns:

- Tracking current folder state and displaying its content
- Handling folder navigation (opening, closing, refreshing...)
- Handling new folder creation
- Toggling show favorite folders only
- Toggling show hidden folders
- Handling current working directory changes

The original version of the component was written in Options API. If we give each line of code a color based on the logical concern it is dealing with, this is how it looks:

![](https://qiniu.espe.work/blog/20220729155551.png)

Notice how code dealing with the same logical concern is forced to be <font color=gree size=4>`split`</font> under different options, located in different parts of the file. In a component that is several hundred lines long, <font color=gree size=4>`understanding and navigating a single logical concern requires constantly scrolling up and down the file`</font>, making it much more difficult than it should be. In addition, if we ever intend to extract a logical concern into a reusable utility, it takes quite a bit of work to find and extract the right pieces of code from different parts of the file.

Here's the same component, before and after the refactor into `Composition API`:

![](https://qiniu.espe.work/blog/20220729155754.png)

Notice how the code related to the same logical concern can now be `grouped together`: we no longer need to jump between different options blocks while working on a specific logical concern. Moreover, we can now move a group of code into an external file with minimal effort, since we no longer need to shuffle the code around in order to extract them. This reduced friction for refactoring is key to the long-term maintainability in large codebases.

#### 1.1.3 Better Type Inference

Composition API utilizes mostly plain variables and functions, which are naturally type friendly.

### 1.1.4 Smaller Production Bundle and Less Overhead

Code written in Composition API and `<script setup>` is also more efficient and `minification-friendly` than Options API equivalent.

This is because the template in a`<script setup>` component is compiled as a function inlined in the same scope of the `<script setup>` code.

Unlike property access from this, the compiled template code can directly access variables declared inside `<script setup>`, without an instance proxy in between. This also leads to better minification because <font color=gree size=4>`all the variable names can be safely shortened`</font>.

### 1.2 Relationship with Options API

#### 1.2.1 Trade-offs

Some users moving from Options API found their Composition API code less organized, and concluded that Composition API is "worse" in terms of code organization. We recommend users with such opinions to look at that problem from a different perspective.

It is true that Composition API no longer provides the "guard rails" that guide you to put your code into respective buckets. In return, you get to author component code like how you would write normal JavaScript. This means you can and should apply any code organization best practices to your Composition API code as you would when writing normal JavaScript. <font color=gree size=4>`If you can write well-organized JavaScript, you should also be able to write well-organized Composition API code.`</font>

Options API does allow you to `"think less"` when writing component code, which is why many users love it. However, in reducing the mental overhead, it also locks you into the prescribed code organization pattern with no escape hatch, which can make it difficult to `refactor` or improve code quality in larger scale projects. In this regard, Composition API provides better long term scalability.

#### 1.2.2 Does Composition API cover all use cases?

Yes in terms of stateful logic. When using Composition API, there are only a few options that may still be needed: `props`, `emits`, `name`, and `inheritAttrs`. If using `<script setup>`, then `inheritAttrs` is typically the only option that may require a separate normal `<script>` block.

#### 1.2.3 Can I use both APIs together?

Yes. You can use Composition API via the setup() option in an Options API component.

However, we only recommend doing so if you have an existing Options API codebase that needs to integrate with new features / external libraries written with Composition API.

## 2. Reactivity in Depth

### 2.1 How Reactivity Works in Vue

There are two ways of intercepting property access in JavaScript: <font color=gree size=4>`getter/setters and Proxies.`</font> Vue 2 used `getter/setters` exclusively due to browser support limitations. <font color=gree size=4>`In Vue 3, Proxies are used for reactive objects and getter/setters are used for refs`</font>. Here's some pseudo-code that illustrates how they work:

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

This explains a few limitations of reactive objects that we have discussed in the fundamentals section:

- When you assign or destructure a reactive object's property to a local variable, the reactivity is "disconnected" because access to the local variable no longer triggers the get / set proxy traps.

- The returned proxy from `reactive()`, although behaving just like the original, has a different identity if we compare it to the original using the `===` operator.

Inside `track()`, we check whether there is a currently running effect. If there is one, we lookup the subscriber effects (stored in a Set) for the property being tracked, and add the effect to the Set:

```javascript
// This will be set right before an effect is about
// to be run. We'll deal with this later.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

`Effect subscriptions` are stored in a global WeakMap`<target, Map<key, Set<effect>>>`data structure. If no subscribing effects Set was found for a property (tracked for the first time), it will be created. This is what the `getSubscribersForProperty()` function does, in short. For simplicity, we will skip its details.

Inside `trigger()`, we again lookup the subscriber effects for the property. But this time we invoke them instead:

```javascript
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Now let's circle back to the `whenDepsChange()` function:

```javascript
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

It wraps the raw `update` function in an effect that sets itself as the current active effect before running the actual update. This enables `track()` calls during the update to locate the current active effect.

At this point, we have created an effect that automatically tracks its dependencies, and re-runs whenever a dependency changes. We call this a <font color=gree size=4>`Reactive Effect`</font>.

Vue provides an API that allows you to create reactive effects: `watchEffect()`. In fact, you may have noticed that it works pretty similarly to the magical whenDepsChange() in the example. We can now rework the original example using actual Vue APIs:

```javascript
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // tracks A0 and A1
  A2.value = A0.value + A1.value
})

// triggers the effect
A0.value = 2
```

Using a reactive effect to mutate a ref isn't the most interesting use case - in fact, using a computed property makes it more declarative:

```javascript
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Internally, `computed` manages its invalidation and re-computation using a reactive effect.

So what's an example of a common and useful reactive effect? Well, `updating the DOM`! We can implement simple "reactive rendering" like this:

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `count is: ${count.value}`
})

// updates the DOM
count.value++
```

In fact, this is pretty close to how a Vue component keeps the state and the DOM in sync - each component instance creates a reactive effect to render and update the DOM. Of course, Vue components use much more efficient ways to update the DOM than innerHTML. This is discussed in Rendering Mechanism.

### 2.2 Runtime vs. Compile-time Reactivity

Vue's reactivity system is primarily runtime-based: the tracking and triggering are all performed while the code is running directly in the browser. The pros of runtime reactivity is that it can work without a build step, and there are fewer edge cases. On the other hand, this makes it constrained by `the syntax limitations of JavaScript`.

We have already encountered a limitation in the previous example: <font color=gree size=4>`JavaScript does not provide a way for us to intercept the reading and writing of local variables, so we have to always access reactive state as object properties, using either reactive objects or refs.`</font>

We have been experimenting with the Reactivity Transform feature to reduce the code verbosity:

```javascript
let A0 = $ref(0)
let A1 = $ref(1)

// track on variable read
const A2 = \$computed(() => A0 + A1)

// trigger on variable write
A0 = 2
```

This snippet compiles into exactly what we'd have written without the transform, by automatically appending `.value` after references to the variables. With Reactivity Transform, Vue's reactivity system becomes a hybrid one.

### 2.3 Reactivity Debugging

It's great that Vue's reactivity system automatically tracks dependencies, but in some cases we may want to figure out exactly <font color=gree size=4>`what is being tracked, or what is causing a component to re-render`</font>.

#### 2.3.1 Component Debugging Hooks

We can debug what dependencies are used during a component's render and which dependency is triggering an update using the `onRenderTracked` and `onRenderTriggered` lifecycle hooks. Both hooks will receive a debugger event which contains information on the dependency in question. It is recommended to place a `debugger` statement in the callbacks to interactively inspect the dependency:

```javascript
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>

```

The debug event objects have the following type:

```typescript
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 2.3.2 Computed Debugging

We can debug computed properties by passing `computed()` a second options object with `onTrack` and `onTrigger` callbacks:

- `onTrack` will be called when a reactive property or ref is tracked as a dependency.
- `onTrigger` will be called when the watcher callback is triggered by the mutation of a dependency.
  Both callbacks will receive debugger events in the same format as component debug hooks:

```typescript
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    debugger
  },
  onTrigger(e) {
    // triggered when count.value is mutated
    debugger
  }
})

// access plusOne, should trigger onTrack
console.log(plusOne.value)

// mutate count.value, should trigger onTrigger
count.value++
```

### 2.3.3 Watcher Debugging

Similar to computed(), watchers also support the onTrack and onTrigger options:

```javascript
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

### 2.4 Integration with External State Systems

Vue's reactivity system works by deeply converting plain JavaScript objects into reactive proxies. The deep conversion can be unnecessary or sometimes unwanted when integrating with external state management systems (e.g. if an external solution also uses Proxies).

The general idea of integrating Vue's reactivity system with an external state management solution is to hold the external state in a `shallowRef`. <font color=gree size=4>`A shallow ref is only reactive when its`.value`property is accessed`</font> - the inner value is left intact. When the external state changes, replace the ref value to trigger updates.

#### 2.4.1 Immutable Data

If you are implementing a undo / redo feature, you likely want to take a snapshot of the application's state on every user edit. However, Vue's mutable reactivity system isn't best suited for this if the state tree is large, because serializing the entire state object on every update can be expensive in terms of both CPU and memory costs.

Immutable data structures solve this by never mutating the state objects - instead, it creates new objects that share the same, unchanged parts with old ones. There are different ways of using immutable data in JavaScript, but we recommend using Immer with Vue because it allows you to use immutable data while keeping the more ergonomic, mutable syntax.

We can integrate Immer with Vue via a simple composable:

```javascript
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

#### 2.4.2 State Machines

State Machine is a model for describing all the possible states an application can be in, and all the possible ways it can transition from one state to another. While it may be overkill for simple components, it can help make complex state flows more `robust` and `manageable`.

One of the most popular state machine implementations in JavaScript is XState. Here's a composable that integrates with it:

```javascript
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

## 3. Rendering Mechanism

Virtual DOM is more of a pattern than a specific technology, so there is no one canonical implementation. We can illustrate the idea using a simple example:

```javascript
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* more vnodes */
  ]
}
```

Here, `vnode` is a plain JavaScript object (a "virtual node") representing a `<div>` element. It contains all the information that we need to create the actual element. It also contains more children vnodes, which makes it the root of a virtual DOM tree.

A runtime renderer can walk a virtual DOM tree and construct a real DOM tree from it. This process is called `mount`.

If we have two copies of virtual DOM trees, the renderer can also walk and compare the two trees, figuring out the differences, and apply those changes to the actual DOM. This process is called `patch`, also known as "`diffing`" or "`reconciliation`".

The main benefit of virtual DOM is that it gives the developer the ability to programmatically create, inspect and compose desired UI structures in a declarative way, while leaving the direct DOM manipulation to the renderer.

### 3.1 Render Pipeline

At the high level, this is what happens when a Vue component is mounted:

1. Compile: Vue templates are compiled into render functions: functions that return virtual DOM trees. This step can be done either ahead-of-time via a build step, or on-the-fly by using the runtime compiler.

2. Mount: The runtime renderer invokes the render functions, walks the returned virtual DOM tree, and creates actual DOM nodes based on it. This step is performed as a reactive effect, so it keeps track of all reactive dependencies that were used.

3. Patch: When a dependency used during mount changes, the effect re-runs. This time, a new, updated Virtual DOM tree is created. The runtime renderer walks the new tree, compares it with the old one, and applies necessary updates to the actual DOM.

![](https://qiniu.espe.work/blog/20220730211340.png)

### 3.2 Templates vs. Render Functions

Vue templates are compiled into virtual DOM render functions. Vue also provides APIs that allow us to skip the template compilation step and directly author render functions. <font color=gree size=4>`Render functions are more flexible than templates when dealing with highly dynamic logic,`</font> because you can work with vnodes using the full power of JavaScript.

So why does Vue recommend templates by default? There are a number of reasons:

1. Templates are closer to actual HTML. This makes it easier to reuse existing HTML snippets, apply accessibility best practices, style with CSS, and for designers to understand and modify.

2. Templates are easier to statically analyze due to their more deterministic syntax. This allows Vue's template compiler to apply many compile-time optimizations to improve the performance of the virtual DOM (which we will discuss below).

In practice, templates are sufficient for most use cases in applications. Render functions are typically only used in reusable components that need to deal with highly dynamic rendering logic. Render function usage is discussed in more detail in Render Functions & JSX.

### 3.3 Compiler-Informed Virtual DOM

The virtual DOM implementation in React and most other virtual-DOM implementations are purely runtime: the reconciliation algorithm cannot make any assumptions about the incoming virtual DOM tree, so it has to fully traverse the tree and diff the props of every vnode in order to ensure correctness. In addition, even if a part of the tree never changes, new vnodes are always created for them on each re-render, resulting in unnecessary memory pressure. This is one of the most criticized aspect of virtual DOM: the somewhat brute-force reconciliation process sacrifices efficiency in return for declarativeness and correctness.

But it doesn't have to be that way. In Vue, the framework controls both the compiler and the runtime. This allows us to implement many compile-time optimizations that only a tightly-coupled renderer can take advantage of. The compiler can statically analyze the template and leave hints in the generated code so that the runtime can take shortcuts whenever possible. At the same time, we still preserve the capability for the user to drop down to the render function layer for more direct control in edge cases. We call this hybrid approach `Compiler-Informed Virtual DOM.`

Below, we will discuss a few major optimizations done by the Vue template compiler to improve the virtual DOM's runtime performance.

### 3.4 Static Hoisting

Quite often there will be parts in a template that do not contain any dynamic bindings:

```html
<div>
  <div>foo</div>
  <!-- hoisted -->
  <div>bar</div>
  <!-- hoisted -->
  <div>{{ dynamic }}</div>
</div>
```

Inspect in Template Explorer

The `foo` and `bar` divs are static - re-creating vnodes and diffing them on each re-render is unnecessary. The Vue compiler automatically hoists their vnode creation calls out of the render function, and reuses the same vnodes on every render. The renderer is also able to completely skip diffing them when it notices the old vnode and the new vnode are the same one.

In addition, when there are enough consecutive static elements, they will be `condensed` into a single "static vnode" that contains the plain HTML string for all these nodes (Example). These static vnodes are mounted by directly setting `innerHTML`. They also cache their corresponding DOM nodes on initial mount - if the same piece of content is reused elsewhere in the app, new DOM nodes are created using native `cloneNode()`, which is extremely efficient.

Patch Flags

For a single element with dynamic bindings, we can also infer a lot of information from it at compile time:

```html
<!-- class binding only -->
<div :class="{ active }"></div>

<!-- id and value bindings only -->
<input :id="id" :value="value" />

<!-- text children only -->
<div>{{ dynamic }}</div>
```

Inspect in Template Explorer

When generating the render function code for these elements, Vue encodes the type of update each of them needs directly in the vnode creation call:

```javascript
createElementVNode(
  'div',
  {
    class: _normalizeClass({ active: _ctx.active })
  },
  null,
  2 /* CLASS */
)
```

The last argument, 2, is a patch flag. An element can have multiple patch flags, which will be merged into a single number. The runtime renderer can then check against the flags using bitwise operations to determine whether it needs to do certain work:

```javascript

if (vnode.patchFlag & PatchFlags.CLASS /_ 2 _/) {
// update the element's class
}

```

Bitwise checks are extremely fast. With the patch flags, Vue is able to do the least amount of work necessary when updating elements with dynamic bindings.

Vue also encodes the type of children a vnode has. For example, a template that has multiple root nodes is represented as a fragment. In most cases, we know for sure that the order of these root nodes will never change, so this information can also be provided to the runtime as a patch flag:

```javascript
export function render() {
  return (
    _openBlock(),
    _createElementBlock(
      _Fragment,
      null,
      [
        /* children */
      ],
      64 /* STABLE_FRAGMENT */
    )
  )
}
```

The runtime can thus completely skip child-order reconciliation for the root fragment.

### 3.5 Tree Flattening

Taking another look at the generated code from the previous example, you'll notice the root of the returned virtual DOM tree is created using a special createElementBlock() call:

```javascript
export function render() {
  return (
    _openBlock(),
    _createElementBlock(
      _Fragment,
      null,
      [
        /* children */
      ],
      64 /* STABLE_FRAGMENT */
    )
  )
}
```

Conceptually, a "block" is a part of the template that has stable inner structure. In this case, the entire template has a single block because it does not contain any structural directives like v-if and v-for.

Each block tracks any descendent nodes (not just direct children) that have patch flags. For example:

```html
<div>
  <!-- root block -->
  <div>...</div>
  <!-- not tracked -->
  <div :id="id"></div>
  <!-- tracked -->
  <div>
    <!-- not tracked -->
    <div>{{ bar }}</div>
    <!-- tracked -->
  </div>
</div>
```

The result is a flattened array that contains only the dynamic descendent nodes:

```shell
div (block root)

- div with :id binding
- div with {{ bar }} binding
```

When this component needs to re-render, it only needs to traverse the flattened tree instead of the full tree. This is called Tree Flattening, and it greatly reduces the number of nodes that need to be traversed during virtual DOM reconciliation. Any static parts of the template are effectively skipped.

`v-if`and `v-for` directives will create new block nodes:

```html
<div>
  <!-- root block -->
  <div>
    <div v-if>
      <!-- if block -->
      ...
      <div></div>
    </div>
  </div>
</div>
```

A child block is tracked inside the parent block's array of dynamic descendants. This retains a stable structure for the parent block.

## 4. Render Functions & JSX

Vue recommends using templates to build applications in the vast majority of cases. However, <font color=gree size=4>`there are situations where we need the full programmatic power of JavaScript`</font>. That's where we can use the render function.

### 4.1 Basic Usage

Creating Vnodes

Vue provides an h() function for creating vnodes:

```javascript
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

`h()` is short for hyperscript - which means "JavaScript that produces HTML (hypertext markup language)". This name is inherited from conventions shared by many virtual DOM implementations. A more descriptive name could be createVnode(), but a shorter name helps when you have to call this function many times in a render function.

The `h()` function is designed to be very `flexible`:

```javascript
// all arguments except the type are optional
h('div')
h('div', { id: 'foo' })

// both attributes and properties can be used in props
// Vue automatically picks the right way to assign it
h('div', { class: 'bar', innerHTML: 'hello' })

// props modifiers such as .prop and .attr can be added
// with '.' and `^' prefixes respectively
h('div', { '.name': 'some-name', '^width': '100' })

// class and style have the same object / array
// value support that they have in templates
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// event listeners should be passed as onXxx
h('div', { onClick: () => {} })

// children can be a string
h('div', { id: 'foo' }, 'hello')

// props can be omitted when there are no props
h('div', 'hello')
h('div', [h('span', 'hello')])

// children array can contain mixed vnodes and strings
h('div', ['hello', h('span', 'hello')])
```

The resulting vnode has the following shape:

```javascript
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

> The full VNode interface contains many other internal properties, but it is strongly recommended to avoid relying on any properties other than the ones listed here. This avoids unintended breakage in case the internal properties are changed.

### 4.2 Declaring Render Functions

When using templates with Composition API, the return value of the `setup()` hook is used to expose data to the template. When using render functions, however, we can directly return the render function instead:

```javascript
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // return the render function
    return () => h('div', props.msg + count.value)
  }
}
```

The render function is declared inside setup() so it naturally has access to the props and any reactive state declared in the same scope.

In addition to returning a single vnode, you can also return strings or `arrays`:

```javascript
export default {
  setup() {
    return () => 'hello world!'
  }
}
import { h } from 'vue'

export default {
  setup() {
    // use an array to return multiple root nodes
    return () => [h('div'), h('div'), h('div')]
  }
}
```

> Make sure to return a function instead of directly returning values! The setup() function is called only once per component, while the returned render function will be called multiple times.

If a render function component doesn't need any instance state, they can also be declared directly as a function for brevity:

```typescript
function Hello() {
  return 'hello world!'
}
```

That's right, this is a valid Vue component! See `Functional Components` for more details on this syntax.

### 4.2 Vnodes Must Be Unique

All vnodes in the component tree must be unique. That means the following render function is invalid:

```javascript
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Yikes - duplicate vnodes!
    p,
    p
  ])
}
```

If you really want to duplicate the same element/component many times, you can do so with a factory function. For example, the following render function is a perfectly valid way of rendering 20 identical paragraphs:

```javascript
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

### 4.3 JSX / TSX

JSX is an XML-like extension to JavaScript that allows us to write code like this:

```javascript
const vnode = <div>hello</div>
```

Inside JSX expressions, use curly braces to embed dynamic values:

```javascript
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

create-vue and Vue CLI both have options for scaffolding projects with pre-configured JSX support. If you are configuring JSX manually, please refer to the documentation of `@vue/babel-plugin-jsx` for details.

Although first introduced by React, JSX actually has no defined runtime semantics and can be compiled into various different outputs. If you have worked with JSX before, do note that `Vue JSX transform is different from React's JSX transform`, so you can't use React's JSX transform in Vue applications. Some notable differences from React JSX include:

- You can use HTML attributes such as `class` and `for` as props - no need to use className or htmlFor.
- Passing children to components (i.e. slots) works differently.

Vue's type definition also provides type inference for TSX usage. When using TSX, make sure to specify `"jsx": "preserve"` in `tsconfig.json` so that TypeScript leaves the JSX syntax intact for Vue JSX transform to process.

### 4.4 Render Function Recipes

Below we will provide some common recipes for implementing template features as their equivalent render functions / JSX.

v-if

Template:

```html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Equivalent render function / JSX:

```javascript

h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])

<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

v-for

Template:

```html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Equivalent render function / JSX:

```javascript
h(
  'ul',
  // assuming `items` is a ref with array value
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```html
<ul>
  {items.value.map(({ id, text }) => { return
  <li key="{id}">{text}</li>
  })}
</ul>
```

v-on#
Props with names that start with on followed by an uppercase letter are treated as event listeners. For example, onClick is the equivalent of @click in templates.

```javascript
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```html
<button
  onClick={(event) => {
    /* ... */
  }}
>
  click me
</button>
```

Event Modifiers#
For the .passive, .capture, and .once event modifiers, they can be concatenated after the event name using camelCase.

For example:

```javascript
h('input', {
  onClickCapture() {
    /* listener in capture mode */
  },
  onKeyupOnce() {
    /* triggers only once */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```html
<input onClickCapture={() => {}} onKeyupOnce={() => {}}
onMouseoverOnceCapture={() => {}} />
```

For other event and key modifiers, the withModifiers helper can be used:

```javascript
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```html
<div onClick={withModifiers(() => {}, ['self'])} />
```

### 4.5 Components

To create a vnode for a component, the first argument passed to h() should be the component definition. This means when using render functions, it is unnecessary to register components - you can just use the imported components directly:

```javascript
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

As we can see, h can work with components imported from any file format as long as it's a valid Vue component.

Dynamic components are straightforward with render functions:

```javascript
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

If a component is registered by name and cannot be imported directly (for example, globally registered by a library), it can be programmatically resolved by using the `resolveComponent()` helper.

### 4.6 Rendering Slots

In render functions, slots can be accessed from the `setup()` context. Each slot on the slots object is a function that returns an array of vnodes:

```javascript
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // default slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // named slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX equivalent:

```html
// default
<div>{slots.default()}</div>

// named
<div>{slots.footer({ text: props.message })}</div>
```

### 4.7 Passing Slots

Passing children to components works a bit differently from passing children to elements. Instead of an array, we need to pass either a slot function, or an object of slot functions. Slot functions can return anything a normal render function can return - which will always be normalized to arrays of vnodes when accessed in the child component.

```javascript
// single default slot
h(MyComponent, () => 'hello')

// named slots
// notice the `null` is required to avoid
// the slots object being treated as props
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

JSX equivalent:

```html
// default
<MyComponent>{() => 'hello'}</MyComponent>

// named
<MyComponent
  >{{ default: () => 'default slot', foo: () =>
  <div>foo</div>
  , bar: () => [<span>one</span>, <span>two</span>] }}</MyComponent
>
```

Passing slots as functions allows them to be invoked lazily by the child component. This leads to the slot's dependencies being tracked by the child instead of the parent, which results in more accurate and efficient updates.

### 4.7 Built-in Components

Built-in components such as`<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` and `<Suspense>` must be imported for use in render functions:

```javascript
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup() {
    return () => h(Transition, { mode: 'out-in' } /* ... */)
  }
}
```

### 4.8 v-model

The v-model directive is expanded to modelValue and onUpdate:modelValue props during template compilation—we will have to provide these props ourselves:

```jsx
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

### 4.9 Custom Directives

Custom directives can be applied to a vnode using withDirectives:

```jsx
import { h, withDirectives } from 'vue'

// a custom directive
const pin = {
  mounted() {
    /* ... */
  },
  updated() {
    /* ... */
  }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [[pin, 200, 'top', { animate: true }]])
```

If the directive is registered by name and cannot be imported directly, it can be resolved using the resolveDirective helper.

### 4.10 Functional components

Functional components are an alternative form of component that don't have any state of their own. They are rendered without creating a component instance, bypassing the usual component lifecycle.

To create a functional component we use a plain function, rather than an options object. The function is effectively the `render` function for the component.

The signature of a functional component is the same as the `setup()` hook:

```javascript
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

Most of the usual configuration options for components are not available for functional components. However, it is possible to define `props` and `emits` by adding them as properties:

```javascript
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

If the `props` option is not specified, then the `props` object passed to the function will contain all attributes, the same as `attrs`. The prop names will not be normalized to camelCase unless the `props` option is specified.

Functional components can be registered and consumed just like normal components. If you pass a function as the first argument to `h()`, it will be treated as a functional component.

## 5. Vue and Web Components

### 5.1 Using Custom Elements in Vue

Vue scores a perfect 100% in the Custom Elements Everywhere tests. Consuming custom elements inside a Vue application largely works the same as using native HTML elements, with a few things to keep in mind:

#### 5.1.1 Skipping Component Resolutio

By default, Vue will attempt to resolve a non-native HTML tag as a registered Vue component before falling back to rendering it as a custom element. This will cause Vue to emit a `"failed to resolve component"` warning during development. To let Vue know that certain elements should be treated as custom elements and skip component resolution, we can specify the compilerOptions.isCustomElement option.

If you are using Vue with a build setup, the option should be passed via build configs since it is a compile-time option.

Example In-Browser Config

```javascript
// Only works if using in-browser compilation.
// If using build tools, see config examples below.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

Example Vite Config

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

Example Vue CLI Config#

```javascript
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

#### 5.1.2 Passing DOM Properties

Since DOM attributes can only be strings, we need to pass complex data to custom elements as DOM properties. When setting props on a custom element, Vue 3 automatically checks DOM-property presence using the in operator and will prefer setting the value as a DOM property if the key is present. This means that, in most cases, you won't need to think about this if the custom element follows the recommended best practices.

However, there could be rare cases where the data must be passed as a DOM property, but the custom element does not properly define/reflect the property (causing the in check to fail). In this case, you can force a v-bind binding to be set as a DOM property using the .prop modifier:

```html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- shorthand equivalent -->
<my-element .user="{ name: 'jack' }"></my-element>
```

#### 5.1.3 Building Custom Elements with Vue

The primary benefit of custom elements is that <font color=gree size=4>`they can be used with any framework, or even without a framework. This makes them ideal for distributing components where the end consumer may not be using the same frontend stack, or when you want to insulate the end application from the implementation details of the components it uses.`</font>

defineCustomElement

Vue supports creating custom elements using exactly the same Vue component APIs via the defineCustomElement method. The method accepts the same argument as defineComponent, but instead returns a custom element constructor that extends HTMLElement:

```html
<my-vue-element></my-vue-element>
```

```javascript
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

todo...

## 6. Animation Techniques

Vue provides the `<Transition>` and `<TransitionGroup>` components for handling enter / leave and list transitions. However, there are many other ways of using animations on the web, even in a Vue application. Here we will discuss a few additional techniques.

### 6.1 Class-based Animations

For elements that are not entering / leaving the DOM, we can trigger animations by dynamically adding a CSS class:

```javascript
const disabled = ref(false)

function warnDisabled() {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}
```

```html
<div :class="{ shake: disabled }">
  <button @click="warnDisabled">Click me</button>
  <span v-if="disabled">This feature is disabled!</span>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

![](https://qiniu.espe.work/blog/Aug-01-2022-10-41-18.gif)

### 6.2 State-driven Animations

Some transition effects can be applied by interpolating values, for instance by binding a style to an element while an interaction occurs. Take this example for instance:

```javascript
const x = ref(0)

function onMousemove(e) {
  x.value = e.clientX
}
```

```html
<div
  @mousemove="onMousemove"
  :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
  class="movearea"
>
  <p>Move your mouse across this div...</p>
  <p>x: {{ x }}</p>
</div>
```

```css
.movearea {
  transition: 0.3s background-color ease;
}
```

![](https://qiniu.espe.work/blog/Aug-01-2022-10-38-53.gif)

In addition to color, you can also use style bindings to animate transform, width, or height. You can even animate `SVG` paths using spring physics - after all, they are all attribute data bindings:

![](https://qiniu.espe.work/blog/Aug-01-2022-10-40-29.gif)

### 6.3 Animating with Watchers

With some creativity, we can use watchers to animate anything based on some numerical state. For example we can animate the number itself:

```javascript
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'

const number = ref(0)
const tweened = reactive({
  number: 0
})

watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
```

```html
Type a number: <input v-model.number="number" />

<p>{{ tweened.number.toFixed(0) }}</p>
```

![](https://qiniu.espe.work/blog/Aug-01-2022-10-43-32.gif)