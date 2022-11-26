---
title: Vue3-Doc-build-in-components-In-English
date: 2022-07-16 10:34:47
permalink: /pages/5cbea2/
categories:
  - 前端
tags:
  - 
---
## 1. Transition

### 1.1 CSS Animations

Native CSS animations are applied in the same way as CSS transitions, with the difference being that \*-enter-from is not removed immediately after the element is inserted, but on an animationend event.

For most CSS animations, we can simply declare them under the _-enter-active and _-leave-active classes. Here's an example:

```html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-16-2022-12-22-47.gif)

### 1.2 Custom Transition Classes

You can also specify custom transition classes by passing the following props to `<Transition>`:

- enter-from-class
- enter-active-class
- enter-to-class
- leave-from-class
- leave-active-class
- leave-to-class

These will override the conventional class names. This is especially useful when you want to combine Vue's transition system with an existing CSS animation library, such as Animate.css:

<!-- assuming Animate.css is included on the page -->

```html
<Transition
  name="custom-classes"
  enter-active-class="animate**animated animate**tada"
  leave-active-class="animate**animated animate**bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

### 1.3 Using Transitions and Animations Together

Vue needs to attach event listeners in order to know when a transition has ended. It can either be `transitionend` or `animationend`, depending on the type of CSS rules applied. If you are only using one or the other, Vue can automatically detect the correct type.

However, in some cases you may want to have both on the same element, for example having a CSS animation triggered by Vue, along with a CSS transition effect on hover. In these cases, you will have to explicitly declare the type you want Vue to care about by passing the type prop, with a value of either animation or transition:

```html
<Transition type="animation">...</Transition>
```

### 1.4 Nested Transitions and Explicit Transition Durations

```html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* rules that target nested elements */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... other necessary CSS omitted */
```

We can even add a transition delay to the nested element on enter, which creates a staggered enter animation sequence:

```css
/* delay enter of nested element for staggered effect */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

However, this creates a small issue. By default, the `<Transition>` component attempts to automatically figure out when the transition has finished by listening to the first transitionend or animationend event on the root transition element. <font color=#3498db size=4>`With a nested transition, the desired behavior should be waiting until the transitions of all inner elements have finished.`</font>

In such cases you can specify an `explicit` transition duration (in milliseconds) using the duration prop on the`<transition>`component. The total duration should match the delay plus transition duration of the inner element:

```html
<Transition :duration="550">...</Transition>
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-16-2022-12-34-05.gif)

If necessary, you can also specify separate values for enter and leave durations using an object:

```html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### 1.5 Performance Considerations

You may notice that the animations shown above are mostly using properties like `transform` and `opacity`. These properties are <font color=#3498db size=4>`efficient`</font> to animate because:

They do not affect the document layout during the animation, so they do not trigger expensive CSS layout calculation on every animation frame.

Most modern browsers can leverage GPU hardware acceleration when animating <font color=#3498db size=4>`transform`</font>.

In comparison, properties like `height` or `margin` will trigger CSS layout, so they are much more expensive to animate, and should be used with caution. We can check resources like CSS-Triggers to see which properties will trigger layout if we animate them.

### 1.6 JavaScript Hooks

You can hook into the transition process with JavaScript by listening to events on the `<Transition>` component:

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

```typescript
// called before the element is inserted into the DOM.
// use this to set the "enter-from" state of the element
function onBeforeEnter(el) {}

// called one frame after the element is inserted.
// use this to start the entering animation.
function onEnter(el, done) {
  // call the done callback to indicate transition end
  // optional if used in combination with CSS
  done()
}

// called when the enter transition has finished.
function onAfterEnter(el) {}
function onEnterCancelled(el) {}

// called before the leave hook.
// Most of the time, you should just use the leave hook
function onBeforeLeave(el) {}

// called when the leave transition starts.
// use this to start the leaving animation.
function onLeave(el, done) {
  // call the done callback to indicate transition end
  // optional if used in combination with CSS
  done()
}

// called when the leave transition has finished and the
// element has been removed from the DOM.
function onAfterLeave(el) {}

// only available with v-show transitions
function onLeaveCancelled(el) {}
```

These hooks can be used in combination with CSS transitions / animations or on their own.

When using JavaScript-only transitions, it is usually a good idea to add the `:css="false"` prop. This explicitly tells Vue to skip auto CSS transition detection. Aside from being slightly more performant, this also prevents CSS rules from accidentally interfering with the transition:

```html
<Transition ... :css="false">
  ...
</Transition>
```

With `:css="false"`, we are also fully responsible for controlling when the transition ends. In this case, the `done` callbacks are required for the `@enter` and `@leave` hooks. Otherwise, the hooks will be called synchronously and the transition will finish immediately.

### 1.7 Reusable Transitions

Transitions can be reused through Vue's component system. To create a reusable transition, we can create a component that wraps the `<Transition>` component and passes down the slot content:

```html
<!-- MyTransition.vue -->
<script>
  // JavaScript hooks logic...
</script>

<template>
  <!-- wrap the built-in Transition component -->
  <Transition name="my-transition" @enter="onEnter" @leave="onLeave">
    <slot></slot>
    <!-- pass down slot content -->
  </Transition>
</template>

<style>
  /*
  Necessary CSS...
  Note: avoid using <style scoped> here since it
  does not apply to slot content.
*/
</style>
```

Now MyTransition can be imported and used just like the built-in version:

```html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

### 1.8 Transition on Appear

If you also want to apply a transition on the initial render of a node, you can add the appear attribute:

```html
<Transition appear>
  ...
</Transition>
```

### 1.9 Transition Between Elements

In addition to toggling an element with `v-if / v-show`, we can also transition between two elements using `v-if / v-else / v-else-if`:

```html
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

### 1.10 Transition Modes

In the previous example, the entering and leaving elements are animated at the same time, and we had to make them `position: absolute` to avoid the layout issue when both elements are present in the DOM.

However, in some cases this isn't an option, or simply isn't the desired behavior. We may want the leaving element to be animated out first, and for the entering element to only be inserted after the leaving animation has finished. Orchestrating such animations manually would be very complicated - luckily, we can enable this behavior by passing `<Transition>` a `mode` prop:

```html
<Transition mode="out-in">
  ...
</Transition>
```

Here's the previous demo with mode="out-in":

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-16-2022-13-10-11.gif)

`<Transition>`also supports `mode="in-out"`, although it's much less frequently used.

### 1.11 Transition Between Components

`<Transition>` can also be used around dynamic components:

```html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-16-2022-13-12-17.gif)

### 1.12 Dynamic Transitions

`<Transition>` props like name can also be dynamic! It allows us to dynamically apply different transitions based on state change:

```html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

This can be useful when you've defined CSS transitions / animations using Vue's transition class conventions and want to switch between them.

You can also apply different behavior in JavaScript transition hooks based on the current state of your component. Finally, <font color=#3498db size=4>`the ultimate way of creating dynamic transitions is through reusable transition components that accept props to change the nature of the transition(s) to be used`</font>. It may sound cheesy, but the only limit really is your imagination.

## 2.TransitionGroup

### 2.1 Differences from `<Transition>`

`<TransitionGroup>` supports the same props, CSS transition classes, and JavaScript hook listeners as `<Transition>`, with the following differences:

- By default, it doesn't render a wrapper element. But you can specify an element to be rendered with the tag prop.

- Transition modes are not available, because we are no longer alternating between mutually exclusive elements.

- Elements inside are always required to have a unique key attribute.

- CSS transition classes will be applied to individual elements in the list, not to the group / container itself.

> When used in DOM templates, it should be referenced as `<transition-group>`

### 2.2 Enter / Leave Transitions

Here is an example of applying enter / leave transitions to a v-for list using `<TransitionGroup>`:

```html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-17-2022-11-27-22.gif)

### 2.3 Move Transitions

The above demo has some obvious `flaws`: when an item is inserted or removed, its surrounding items `instantly` "jump" into place instead of moving smoothly. We can fix this by adding a few additional CSS rules:

```css
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
```

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jul-17-2022-11-30-56.gif)

### 2.4 Staggering List Transitions

By communicating with JavaScript transitions through data attributes, it's also possible to stagger transitions in a list. First, we render the index of an item as a data attribute on the DOM element:

```html
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li v-for="(item, index) in computedList" :key="item.msg" :data-index="index">
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Then, in JavaScript hooks, we animate the element with a delay based on the data attribute. This example is using the `GreenSock library` to perform the animation:

```javascript
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

## 3.KeepAlive

### 3.1 Include / Exclude

By default, `<KeepAlive>` will cache any component instance inside. We can customize this behavior via the `include` and `exclude` props. Both props can be a comma-delimited string, a `RegExp`, or an array containing either types:

```html
<!-- comma-delimited string -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (use `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Array (use `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

The match is checked against the component's `name` option, so components that need to be conditionally cached by `KeepAlive` must explicitly declare a `name` option.

### 3.2 Max Cached Instances

We can limit the maximum number of component instances that can be cached via the max prop. When max is specified, `<KeepAlive>` behaves like an <font color=#3498db size=4>`LRU cache`</font> : if the number of cached instances is about to exceed the specified max count, the least recently accessed cached instance will be destroyed to make room for the new one.

```html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

### 3.3 Lifecycle of Cached Instance

When a component instance is removed from the DOM but is part of a component tree cached by `<KeepAlive>`, it goes into a deactivated state instead of being unmounted. When a component instance is inserted into the DOM as part of a cached tree, it is activated.

A kept-alive component can register lifecycle hooks for these two states using <font color=#3498db size=4>`onActivated()`</font> and <font color=#3498db size=4>`onDeactivated()`</font>:

```html
<script setup>
  import { onActivated, onDeactivated } from 'vue'

  onActivated(() => {
    // called on initial mount
    // and every time it is re-inserted from the cache
  })

  onDeactivated(() => {
    // called when removed from the DOM into the cache
    // and also when unmounted
  })
</script>
```

Note that:

- `onActivated` is also called on mount, and `onDeactivated` on unmount.

- Both hooks work for not only the root component cached by `<KeepAlive>`, but also descendent components in the cached tree.

## 4. Teleport

`<Teleport>` is a built-in component that allows us to "teleport" a part of a component's template into a DOM node that exists <font color=#3498db size=4>`outside`</font> the DOM hierarchy of that component.

```html
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

The to target of`<Teleport>`expects a CSS selector string or an actual DOM node. Here, we are essentially telling Vue to "teleport this template fragment to the body tag".

You can click the button below and inspect the`<body>` tag via your browser's devtools:

> The teleport to target must be already in the DOM when the `<Teleport>` component is mounted. Ideally, this should be an element outside the entire Vue application. If targeting another element rendered by Vue, you need to make sure that element is mounted before the `<Teleport>`.

### 4.1 Using with Components

`<Teleport>`only alters the rendered DOM structure - it does not affect the logical hierarchy of the components. That is to say, if `<Teleport>` contains a component, that component will remain a logical child of the parent component containing the `<Teleport>`. Props passing and event emitting will continue to work the same way.

This also means that injections from a parent component work as expected, and that <font color=#3498db size=4>`the child component will be nested below the parent component in the Vue Devtools`</font> , instead of being placed where the actual content moved to.

### 4.2 Disabling Teleport

In some cases, we may want to conditionally disable `<Teleport>`. For example, we may want to render a component as an overlay for desktop, but inline on mobile. `<Teleport>` supports the disabled prop which can be dynamically toggled:

```html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

### 4.3 Multiple Teleports on the Same Target

A common use case would be a reusable `<Modal>` component, with the potential for multiple instances to be active at the same time. For this kind of scenario, multiple `<Teleport>` components can mount their content to the same target element. The order will be a simple append - later mounts will be located after earlier ones within the target element.

Given the following usage:

```html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

The rendered result would be:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 5. Suspense

`<Suspense>` is a built-in component for orchestrating async dependencies in a component tree. It can render a loading state while waiting for <font color=#3498db size=4>`multiple nested async dependencies down the component tree to be resolved`</font> .

### 5.1 Async Dependencies

To explain the problem `<Suspense>` is trying to solve and how it interacts with these async dependencies, let's imagine a component hierarchy like the following:

```shell
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (component with async setup())
   └─ <Content>
      ├─ <ActivityFeed> (async component)
      └─ <Stats> (async component)
```

In the component tree there are multiple nested components whose rendering depends on some async resource to be resolved first. Without `<Suspense>`, each of them will need to handle its own loading / error and loaded states. In the worst case scenario, we may see three loading spinners on the page, with content displayed at different times.

The `<Suspense>` component gives us the ability to display top-level loading / error states while we <font color=#3498db size=4>`wait on these nested async dependencies to be resolved`</font> .

There are two types of async dependencies that `<Suspense>` can wait on:

1. Components with an async `setup()` hook. This includes components using `<script setup>` with top-level await expressions.

2. Async Components.

async setup()

A Composition API component's setup() hook can be async:

```javascript
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

If using `<script setup>`, the presence of top-level await expressions automatically makes the component an async dependency:

```html
<script setup>
  const res = await fetch(...)
  const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```


### 5.1 Async Components

Async components are "suspensible" by default. This means that if it has a `<Suspense>` in the parent chain, it will be treated as an async dependency of that `<Suspense>`. In this case, the loading state will be controlled by the `<Suspense>`, and the component's own loading, error, delay and timeout options will be ignored.

The async component can opt-out of Suspense control and let the component always control its own loading state by specifying suspensible: false in its options.