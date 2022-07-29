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
