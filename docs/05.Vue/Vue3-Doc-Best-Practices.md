## 1. Production Deployment

During development, Vue provides a number of features to improve the development experience:

- Warning for common errors and pitfalls
- Props / events validation
- Reactivity debugging hooks
- Devtools integration

However, these features become useless in production. Some of the warning checks can also incur a small amount of performance overhead. When deploying to production, we should drop all the unused, development-only code branches for smaller payload size and better performance.

### 1.1 With Build Tools

Projects scaffolded via create-vue (based on Vite) or Vue CLI (based on webpack) are pre-configured for production builds.

If using a custom setup, make sure that:

1. vue resolves to vue.runtime.esm-bundler.js.
2. The compile time feature flags are properly configured.
3. process.env.NODE_ENV is replaced with "production" during build.

### 1.2 Tracking Runtime Errors

The <font color=gree size=4>`app-level`</font> error handler can be used to report errors to tracking services:

```javascript
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // report error to tracking services
}
```

## 2. Performance

First, let's discuss the two major aspects of web performance:

- Page Load Performance: how fast the application <font color=gree size=4>`shows content and becomes interactive`</font> on the initial visit. This is usually measured using web vital metrics like Largest Contentful Paint (LCP) and First Input Delay.

- Update Performance: <font color=gree size=4>`how fast the application updates in response to user input`</font>. For example, how fast a list updates when the user types in a search box, or how fast the page switches when the user clicks a navigation link in a Single-Page Application (SPA).

### 2.1 Page Load Optimizations

There are many framework-agnostic aspects for optimizing page load performance - check out this web.dev guide for a comprehensive round up. Here, we will primarily focus on techniques that are specific to Vue.

### 2.1.1 Bundle Size and Tree-shaking

One of the most effective ways to improve page load performance is shipping smaller JavaScript bundles. Here are a few ways to reduce bundle size when using Vue:

1. Use a build step if possible.

- Many of Vue's APIs are "tree-shakable" if bundled via a modern build tool. For example, if you don't use the built-in `<Transition>`component, it won't be included in the final production bundle. <font color=gree size=4>`Tree-shaking`</font> can also remove other unused modules in your source code.

- When <font color=gree size=4>`using a build step, templates are pre-compiled so we don't need to ship the Vue compiler to the browser`</font>. This saves 14kb min+gzipped JavaScript and avoids the runtime compilation cost.

2. Be cautious of size when introducing new <font color=gree size=4>`dependencies`</font>! In real world applications, bloated bundles are most often a result of introducing heavy dependencies without realizing it.

- If using a build step, prefer dependencies that offer `ES module` formats and are tree-shaking friendly. For example, prefer lodash-es over lodash.

- Check a dependency's size and evaluate whether it is worth the functionality it provides. Note if the dependency is tree-shaking friendly, the actual size increase will depend on the APIs you actually import from it. Tools like bundlejs.com can be used for quick checks, but measuring with your actual build setup will always be the most accurate.

If you are using Vue primarily for progressive enhancement and prefer to avoid a build step, consider using petite-vue (only 6kb) instead.

### 2.2 Code Splitting

Code splitting is where a build tool splits the application bundle into multiple smaller chunks, which can then be loaded on demand or in parallel. With proper code splitting, features required at page load can be downloaded immediately, with additional chunks being lazy loaded only when needed, thus improving performance.

Bundlers like Rollup (which Vite is based upon) or webpack can automatically create split chunks by detecting the ESM dynamic import syntax:

```typescript
// lazy.js and its dependencies will be split into a separate chunk
// and only loaded when `loadLazy()` is called.
function loadLazy() {
  return import('./lazy.js')
}
```

Lazy loading is best used on features that are not immediately needed after initial page load. In Vue applications, this is typically used in combination with Vue's Async Component feature to create split chunks for component trees:

```typescript
import { defineAsyncComponent } from 'vue'

// a separate chunk is created for Foo.vue and its dependencies.
// it is only fetched on demand when the async component is
// rendered on the page.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

If using client-side routing via Vue Router, it is strongly recommended to use `async components` as route components.

### 2.3 Update Optimizations

Props Stability

In Vue, a child component only updates when at least one of its received props has changed. Consider the following example:

```html
<ListItem v-for="item in list" :id="item.id" :active-id="activeId" />
```

Inside the `<ListItem>` component, it uses its id and activeId props to determine whether it is the currently active item. While this works, the problem is that whenever activeId changes, every `<ListItem>` in the list has to update!

Ideally, only the items whose active status changed should update. We can achieve that by moving the active status computation into the parent, and make `<ListItem>` directly accept an `active` prop instead:

```html
<ListItem v-for="item in list" :id="item.id" :active="item.id === activeId" />
```

Now, for most components the `active` prop will remain the same when `activeId` changes, so they no longer need to update. In general, the idea is keeping the props passed to child components as stable as possible.

`v-once`

v-once is a built-in directive that can be used to render content that relies on runtime data but never needs to update. The entire sub-tree it is used on will be skipped for all future updates. Consult its API reference for more details.

`v-memo`

v-memo is a built-in directive that can be used to conditionally skip the update of large sub-trees or v-for lists. Consult its API reference for more details.

### 2.4 General Optimizations

Virtualize Large Lists

One of the most common performance issues in all frontend applications is rendering large lists. No matter how performant a framework is, rendering a list with thousands of items will be slow due to the sheer number of DOM nodes that the browser needs to handle.

However, we don't necessarily have to render all these nodes upfront. In most cases, the user's screen size can display only a small subset of our large list. We can greatly improve the performance with `list virtualization`, the technique of only rendering the items that are currently in or close to the viewport in a large list.

Implementing list virtualization isn't easy, luckily there are existing community libraries that you can directly use:

- vue-virtual-scroller
- vue-virtual-scroll-grid

### 2.5 Reduce Reactivity Overhead for Large Immutable Structures

Vue's reactivity system is deep by default. While this makes state management intuitive, it does create a certain level of overhead when the data size is large, because every property access triggers proxy traps that perform dependency tracking. This typically becomes noticeable when dealing with large arrays of deeply nested objects, where a single render needs to access 100,000+ properties, so it should only affect very specific use cases.

Vue does provide an escape hatch to opt-out of deep reactivity by using`shallowRef()` and `shallowReactive()`. Shallow APIs create state that is reactive only at the <font color=gree size=4>`root level`</font>, and exposes all nested objects untouched. This keeps nested property access fast, with the trade-off being that we must now treat all nested objects as immutable, and updates can only be triggered by replacing the root state:

```typescript
const shallowArray = shallowRef([
  /* big list of deep objects */
])

// this won't trigger updates...
shallowArray.value.push(newObject)
// this does:
shallowArray.value = [...shallowArr.value, newObject]

// this won't trigger updates...
shallowArray.value[0].foo = 1
// this does:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### 2.6 Avoid Unnecessary Component Abstractions

Sometimes we may create renderless components or higher-order components (i.e. components that render other components with extra props) for better abstraction or code organization. While there is nothing wrong with this, do keep in mind that component instances are much more expensive than plain DOM nodes, and creating too many of them due to abstraction patterns will incur performance costs.

Note that reducing only a few instances won't have noticeable effect, so don't sweat it if the component is rendered only a few times in the app. The best scenario to consider this optimization is again in large lists. Imagine a list of 100 items where each item component contains many child components. Removing one unnecessary component abstraction here could result in a reduction of hundreds of component instances.

## 3. Security

### 3.1 Rule No.1: Never Use Non-trusted Templates

The most fundamental security rule when using Vue is never use <font color=gree size=4>`non-trusted`</font> content as your component template. Doing so is equivalent to allowing arbitrary JavaScript execution in your application - and worse, could lead to server breaches if the code is executed during server-side rendering. An example of such usage:

```typescript
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NEVER DO THIS
}).mount('#app')
```

Vue templates are compiled into JavaScript, and <font color=gree size=4>`expressions inside templates will be executed as part of the rendering process`</font>. Although the expressions are evaluated against a specific rendering context

due to the complexity of potential global execution environments, it is impractical for a framework like Vue to completely shield you from potential malicious code execution without incurring unrealistic performance overhead.

The most straightforward way to avoid this category of problems altogether is to <font color=gree size=4>`make sure the contents of your Vue templates are always trusted and entirely controlled by you.`</font>

### 3.2 What Vue Does to Protect You

### 3.2.1 HTML content

Whether using templates or render functions, content is automatically escaped. That means in this template:

```html
<h1>{{ userProvidedString }}</h1>
```

if userProvidedString contained:

```html
'
<script>
  alert('hi')
</script>
'
```

then it would be escaped to the following HTML:

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

thus preventing the script injection. This escaping is done using native browser APIs, like textContent, so a vulnerability can only exist if the browser itself is vulnerable.

### 3.2.2 Attribute bindings

Similarly, dynamic attribute bindings are also automatically escaped. That means in this template:

```html
<h1 :title="userProvidedString">
  hello
</h1>
```

if userProvidedString contained:

```html
'" onclick="alert(\'hi\')'
```

then it would be escaped to the following HTML:

```html
&quot; onclick=&quot;alert('hi')
```

thus preventing the close of the `title` attribute to inject new, arbitrary HTML. This escaping is done using native browser APIs, like `setAttribute`, so a vulnerability can only exist if the browser itself is vulnerable.

### 3.3 Potential Dangers

In any web application, allowing unsanitized, user-provided content to be executed as HTML, CSS, or JavaScript is potentially dangerous, so should be avoided wherever possible. There are times when some risk may be acceptable though.

For example, services like `CodePen` and `JSFiddle` allow user-provided content to be executed, but it's in a context where this is expected and `sandboxed` to some extent inside iframes. In the cases when an important feature inherently requires some level of vulnerability, it's up to your team to weigh the importance of the feature against the worst-case scenarios the vulnerability enables.

### 3.4 Injecting HTML

As you learned earlier, Vue automatically escapes HTML content, preventing you from accidentally injecting executable HTML into your application. However, in cases where you know the HTML is safe, you can explicitly render HTML content:

Using a template:

```html
<div v-html="userProvidedHtml"></div>
```

Using a render function:

```javascript
h('div', {
  innerHTML: this.userProvidedHtml
})
```

Using a render function with JSX:

```html
<div innerHTML="{this.userProvidedHtml}"></div>
```

> Note that user-provided HTML can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that HTML can ever be exposed to it. Additionally, allowing users to write their own Vue templates brings similar dangers.

### 3.5 Injecting URLs

In a URL like this:

```html
<a :href="userProvidedUrl">
  click me
</a>
```

There's a potential security issue if the URL has not been "sanitized" to prevent JavaScript execution using `javascript`:. There are libraries such as sanitize-url to help with this, but note:

> If you're ever doing URL sanitization on the frontend, you already have a security issue. User-provided URLs should always be sanitized by your backend before even being saved to a database. Then the problem is avoided for every client connecting to your API, including native mobile apps. Also note that even with sanitized URLs, Vue cannot help you guarantee that they lead to safe destinations.

### 3.6 Injecting Styles

Looking at this example:

```html
<a :href="sanitizedUrl" :style="userProvidedStyles">
  click me
</a>
```

let's assume that sanitizedUrl has been sanitized, so that it's definitely a real URL and not JavaScript. With the userProvidedStyles, malicious users could still provide CSS to "click jack", e.g. styling the link into a transparent box over the "Log in" button. Then if https://user-controlled-website.com/ is built to resemble the login page of your application, they might have just captured a user's real login information.

You may be able to imagine how allowing user-provided content for a `<style>` element would create an even greater vulnerability, giving that user full control over how to style the entire page. That's why Vue prevents rendering of style tags inside templates, such as:

```html
<style>
  {{ userProvidedStyles }}
</style>
```

To keep your users fully safe from click jacking, we recommend <font color=gree size=4>`only allowing full control over CSS inside a sandboxed iframe`</font>. Alternatively, when providing user control through a style binding, we recommend using its object syntax and <font color=gree size=4>`only allowing users to provide values for specific properties it's safe for them to control`</font>, like this:

```html
<a
  :href="sanitizedUrl"
  :style="{
color: userProvidedColor,
background: userProvidedBackground
}"
>
  click me
</a>
```

### 3.7 Injecting JavaScript

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so should be avoided.

> Note that user-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.

Sometimes we receive vulnerability reports on how it's possible to do cross-site scripting (XSS) in Vue templates. In general, we do not consider such cases to be actual vulnerabilities, because there's no practical way to protect developers from the two scenarios that would allow XSS:

The developer is explicitly asking Vue to render user-provided, unsanitized content as Vue templates. This is inherently unsafe and there's no way for Vue to know the origin.

The developer is mounting Vue to an entire HTML page which happens to contain server-rendered and user-provided content. This is fundamentally the same problem as #1, but sometimes devs may do it without realizing. This can lead to possible vulnerabilities where the attacker provides HTML which is safe as plain HTML but unsafe as a Vue template. The best practice is to never mount Vue on nodes that may contain server-rendered and user-provided content.

### 3.8 Best Practices
 
The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might be opening yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for Potential Dangers, we also recommend familiarizing yourself with these resources:

- HTML5 Security Cheat Sheet
- OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

### 3.9 Backend Coordination

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g. by submitting CSRF tokens with form submissions.

### 3.10 Server-Side Rendering (SSR)

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout our SSR documentation to avoid vulnerabilities.
