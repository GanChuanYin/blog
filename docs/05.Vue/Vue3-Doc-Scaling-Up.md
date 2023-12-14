---
title: Vue3-Doc-Scaling-Up
date: 2022-07-19 09:49:10
permalink: /pages/d7bbab/
categories:
  - Vue
tags:
  - 
---
## 1. Single-File Components

Vue Single-File Components (a.k.a. `*.vue` files, abbreviated as SFC) is a special file format that allows us to encapsulate the template, logic, and styling of a Vue component in a single file.

### 1.2 Why SFC

While SFCs require a build step, there are numerous benefits in return:

- Author modularized components using familiar HTML, CSS and JavaScript syntax
- Colocation of inherently coupled concerns
- Pre-compiled templates
- Component-scoped CSS
- More ergonomic syntax when working with Composition API
- More compile-time optimizations by cross-analyzing template and script
- IDE support with auto-completion and type-checking for template expressions
- Out-of-the-box Hot-Module Replacement (HMR) support

SFC is a defining feature of Vue as a framework, and is the recommended approach for using Vue in the following scenarios:

- Single-Page Applications (SPA)
- Static Site Generation (SSG)
- Any non-trivial frontend where a build step can be justified for better development experience (DX).

Vue SFC is a framework-specific file format and must be pre-compiled by <font color=#3498db size=4>`@vue/compiler-sfc`</font> into standard JavaScript and CSS. A compiled SFC is a standard JavaScript (ES) module - which means with proper build setup you can import an SFC like a module:

```javascript
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

<font color=#3498db size=4>`<style>tags inside SFCs are typically injected as native <style> tags during development to support hot updates. For production they can be extracted and merged into a single CSS file.`</font>

### 1.3 What About Separation of Concerns?

Some users coming from a traditional web development background may have the concern that SFCs are mixing different concerns in the same place - which HTML/CSS/JS were supposed to separate!

To answer this question, it is important for us to agree that <font color=#3498db size=4>`separation of concerns is not equal to the separation of file types`</font> . The ultimate goal of engineering principles is to improve the `maintainability` of codebases. Separation of concerns, when applied dogmatically as separation of file types, does not help us reach that goal in the context of increasingly complex frontend applications.

In modern UI development, we have found that instead of dividing the codebase into three huge layers that interweave with one another, it makes much more sense to divide them into loosely-coupled components and compose them. Inside a component, its template, logic, and styles are inherently coupled, and colocating them actually makes the component more cohesive and maintainable.

## 2. Tooling

### 2.1 Project Scaffolding

- Vite (recommended)

- Vue CLI (outdated)

### 2.2 IDE Support

VSCode + the Volar extension.

> Volar replaces Vetur, our previous official VSCode extension for Vue 2. If you have Vetur currently installed, make sure to disable it in Vue 3 projects.

### 2.3 Linting

The Vue team maintains `eslint-plugin-vue`, an ESLint plugin that supports SFC-specific linting rules.

Users previously using Vue CLI may be used to having linters configured via webpack loaders. However when using a Vite-based build setup, our general recommendation is:

1. npm install -D eslint eslint-plugin-vue, then follow eslint-plugin-vue's configuration guide.

2. Setup ESLint IDE extensions, for example ESLint for VSCode, so you get linter feedback right in your editor during development. This also avoids unnecessary linting cost when starting the dev server.

3. Run ESLint as part of the production build command, so you get full linter feedback before shipping to production.

4. (Optional) Setup tools like lint-staged to automatically lint modified files on git commit.

## 3. Routing

Simple Routing from Scratch

If you only need very simple routing and do not wish to involve a full-featured router library, you can do so with Dynamic Components and update the current component state by listening to browser <font color=#3498db size=4>`hashchange`</font> events or using the History API.

Here's a bare-bone example:

```html
<script setup>
  import { ref, computed } from 'vue'
  import Home from './Home.vue'
  import About from './About.vue'
  import NotFound from './NotFound.vue'

  const routes = {
    '/': Home,
    '/about': About
  }

  const currentPath = ref(window.location.hash)

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
  })

  const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound
  })
</script>

<template>
  <a href="#/">Home</a> | <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

## 4. State Management

### 4.1 What is State Management?

Technically, every Vue component instance already "manages" its own reactive state. Take a simple counter component as an example:

```html
<script setup>
  import { ref } from 'vue'

  // state
  const count = ref(0)

  // actions
  function increment() {
    count.value++
  }
</script>

<!-- view -->
<template>{{ count }}</template>
```

It is a self-contained unit with the following parts:

- The state, the source of truth that drives our app;
- The view, a declarative mapping of the state;
- The actions, the possible ways the state could change in reaction to user inputs from the view.

This is a simple representation of the concept of "one-way data flow":

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220720101029.png)

However, the simplicity starts to break down when we have <font color=#3498db size=4>`multiple components that share a common state:`</font>

1. Multiple views may depend on the same piece of state.
2. Actions from different views may need to mutate the same piece of state.

For case one, a possible workaround is by "lifting" the shared state up to a common ancestor component, and then pass it down as props. However, this quickly gets tedious in component trees with deep hierarchies, leading to another problem known as Prop Drilling.

For case two, we often find ourselves resorting to solutions such as reaching for direct parent / child instances via template refs, or trying to mutate and synchronize multiple copies of the state via emitted events. Both of these patterns are brittle and quickly lead to unmaintainable code.

A simpler and more straightforward solution is to extract the shared state out of the components, and manage it in a global singleton. With this, our component tree becomes a big "view", and any component can access the state or trigger actions, no matter where they are in the tree!

### 4.2 Simple State Management with Reactivity API

If you have a piece of state that should be shared by multiple instances, you can use <font color=#3498db size=4>`reactive()`</font> to create a reactive object, and then import it from multiple components:

```javascript
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

```html
<!-- ComponentA.vue -->
<script setup>
  import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
<!-- ComponentB.vue -->
<script setup>
  import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

Now whenever the store object is mutated, both `<ComponentA>` and `<ComponentB>` will update their views automatically - we have a single source of truth now.

However, this also means any component importing store can mutate it however they want:

```html
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

While this works in simple cases, global state that can be arbitrarily mutated by any component is not going to be very maintainable in the long run. To ensure <font color=#3498db size=4>`the state-mutating logic is centralized`</font> like the state itself, it is recommended <font color=#3498db size=4>`to define methods on the store with names that express the intention of the actions:`</font>

> Note the click handler uses store.increment() with the parenthesis - this is necessary to call the method with the proper this context since it's not a component method.

Although here we are using a single reactive object as a store, you can also share reactive state created using other Reactivity APIs such as ref() or computed(), or even return global state from a Composable:

```js
import { ref } from 'vue'

// global state, created in module scope
const globalCount = ref(1)

export function useCount() {
  // local state, created per-component
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

The fact that Vue's reactivity system is decoupled from the component model makes it extremely flexible.


### 4.3 Pinia 

Pinia is a state management library that implements all of the above. It is maintained by the Vue core team, and works with both Vue 2 and Vue 3.