> The way to learn something well is to read the official documentation

## 1.Components In-Depth

### 1.1 Component Registration

#### 1.1.1Global Registration

```typescript
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // the registered name
  'MyComponent',
  // the implementation
  {
    /* ... */
  }
)
```

The app.component() method can be chained:

```typescript
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

#### 1.1.2 Local Registration

While convenient, global registration has a few drawbacks:

1. Global registration prevents build systems from removing unused components (a.k.a "tree-shaking"). If you globally register a component but end up not using it anywhere in your app, it will still be included in the final bundle.

2. Global registration makes dependency relationships less explicit in large applications. It makes it difficult to locate a child component's implementation from a parent component using it. This can affect long-term maintainability similar to using too many global variables.

#### 1.1.3 Component Name Casing

Throughout the guide, we are using PascalCase names when registering components. This is because:

PascalCase names are valid JavaScript identifiers. This makes it easier to import and register components in JavaScript. It also helps IDEs with auto-completion.

\<PascalCase /> makes it more obvious that this is a Vue component instead of a native HTML element in templates. It also differentiates Vue components from custom elements (web components).

Luckily, Vue supports resolving kebab-case tags to components registered using PascalCase. This means a component registered as MyComponent can be referenced in the template via both \<MyComponent> and \<my-component>. This allows us to use the same JavaScript component registration code regardless of template source.

## 2. props

There are usually two cases where it's tempting to mutate a prop:

The prop is used to pass in an initial value; the child component wants to use it as a local data property afterwards. In this case, <font color=#00dddd size=4> it's best to define a local data property that uses the prop as its initial value:</font>

```typescript
const props = defineProps(['initialCounter'])

// counter only uses props.initialCounter as the initial value;
// it is disconnected from future prop updates.
const counter = ref(props.initialCounter)
```

The prop is passed in as a raw value that needs to be transformed. In this case, it's best to define a computed property using the prop's value:

```typescript
const props = defineProps(['size'])

// computed property that auto-updates when the prop changes
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```

### 2.1 Mutating Object / Array Props

When objects and arrays are passed as props, while the child component cannot mutate the prop binding, it will be able to mutate the object or array's nested properties. <font color=#00dddd size=4> This is because in JavaScript objects and arrays are passed by reference, and it is unreasonably expensive for Vue to prevent such mutations.</font>

The main drawback of such mutations is that it allows the child component to affect parent state in a way that isn't obvious to the parent component, potentially making it more difficult to reason about the data flow in the future. As a best practice, you should avoid such mutations unless the parent and child are tightly coupled by design. <font color=#00dddd size=4> In most cases, the child should emit an event to let the parent perform the mutation.</font>

### 2.2 Prop Validation

Components can specify requirements for their props, such as the types you've already seen. If a requirement is not met, Vue will warn you in the browser's JavaScript console. This is especially useful when developing a component that is intended to be used by others.

To specify prop validations, you can provide an object with validation requirements to the defineProps() macro, instead of an array of strings. For example:

```typescript
defineProps({
  // Basic type check
  //  (`null` and `undefined` values will allow any type)
  propA: Number,
  // Multiple possible types
  propB: [String, Number],
  // Required string
  propC: {
    type: String,
    required: true
  },
  // Number with a default value
  propD: {
    type: Number,
    default: 100
  },
  // Object with a default value
  propE: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function. The function receives the raw
    // props received by the component as the argument.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Custom validator function
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Function with a default value
  propG: {
    type: Function,
    // Unlike object or array default, this is not a factory function - this is a function to serve as a default value
    default() {
      return 'Default function'
    }
  }
})
```

Additional details:

- All props are optional by default, unless required: true is specified.

- An absent optional prop other than Boolean will have undefined value.

- The Boolean absent props will be cast to false. You should set a default value for it in order to get desired behavior.

- If a default value is specified, it will be used if the resolved prop value is undefined - this includes both when the prop is absent, or an explicit undefined value is passed.

If using Type-based props declarations, Vue will try its best to compile the type annotations into equivalent runtime prop declarations. For example,

```typescript
// defineProps
<{ msg: string }>
// will be compiled into
{ msg: { type: String, required: true }}.
```

### 2.3 Runtime Type Checks

The type can be one of the following native constructors:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

In addition, type can also be a custom class or constructor function and the assertion will be made with an instanceof check. For example, given the following class:

```typescript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

You could use it as a prop's type:

```typescript
defineProps({
  author: Person
})
```

to validate that the value of the author prop was created with new Person.

## 3. Component Events

The \$emit method that we used in the \<template> isn't accessible within the \<script setup> section of a component, but defineEmits() returns an equivalent function that we can use instead:

```html
<script setup>
  const emit = defineEmits(['inFocus', 'submit'])

  function buttonClick() {
    emit('submit')
  }
</script>
```

If you are using TypeScript with \<script setup>, it's also possible to declare emitted events using pure type annotations:

```html
<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()
</script>
```

### 3.1 Events Validation

Similar to prop type validation, an emitted event can be validated if it is defined with the object syntax instead of the array syntax.

To add validation, the event is assigned a function that receives the arguments passed to the emit call and returns a boolean to indicate whether the event is valid or not.

```html
<script setup>
  const emit = defineEmits({
    // No validation
    click: null,

    // Validate submit event
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  })

  function submitForm(email, password) {
    emit('submit', { email, password })
  }
</script>
```

### 3.2 Usage with v-model

Custom events can also be used to create custom inputs that work with v-model. Remember that:

```html
<input v-model="searchText" />
```

does the same thing as:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

When used on a component, v-model instead does this:

```html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

For this to actually work though, the \<input> inside the component must:

Bind the value attribute to the modelValue prop
On input, emit an update:modelValue event with the new value
Here's that in action:

```html
<!-- CustomInput.vue -->
<script setup>
  defineProps(['modelValue'])
  defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Now v-model should work perfectly with this component:

```html
<CustomInput v-model="searchText" />
```

### 3.3 Another way of implementing v-model

Another way of implementing v-model within this component is to use a writable computed property with both a getter and a setter. The get method should return the modelValue property and the set method should emit the corresponding event:

```html
<!-- CustomInput.vue -->
<script setup>
  import { computed } from 'vue'

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])

  const value = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    }
  })
</script>

<template>
  <input v-model="value" />
</template>
```

### 3.4 v-model

By default, v-model on a component uses modelValue as the prop and update:modelValue as the event. We can modify these names passing an argument to v-model:

```html
<MyComponent v-model:title="bookTitle" />
```

In this case, the child component should expect a title prop and emit an update:title event to update the parent value:

```html
<!-- MyComponent.vue -->
<script setup>
  defineProps(['title'])
  defineEmits(['update:title']) //title
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

### 3.5 Multiple v-model bindings

By leveraging the ability to target a particular prop and event as we learned before with v-model arguments, we can now create multiple v-model bindings on a single component instance.

Each v-model will sync to a different prop, without the need for extra options in the component:

father component:

```html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
<script setup>
```

child component

```html
<script setup>
  defineProps({
    firstName: String,
    lastName: String
  })

  defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

### 3.6 Handling v-model modifiers

When we were learning about form input bindings, we saw that v-model has built-in modifiers - .trim, .number and .lazy. In some cases, however, you might also want to add your own custom modifiers.

Let's create an example custom modifier, capitalize, that capitalizes the first letter of the string provided by the v-model binding:

```html
<MyComponent v-model.capitalize="myText" />
```

Modifiers added to a component `v-model` will be provided to the component via the `modelModifiers` prop. In the below example, we have created a component that contains a `modelModifiers` prop that defaults to an empty object:

```html
<script setup>
  const props = defineProps({
    modelValue: String,
    modelModifiers: { default: () => ({}) }
  })

  defineEmits(['update:modelValue'])

  console.log(props.modelModifiers) // { capitalize: true }
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Notice the component's modelModifiers prop contains capitalize and its value is true - due to it being set on the`v-model` binding `v-model.capitalize="myText"`.

Now that we have our prop set up, we can check the modelModifiers object keys and write a handler to change the emitted value. In the code below we will capitalize the string whenever the `<input />` element fires an input event.

```html
<script setup>
  const props = defineProps({
    modelValue: String,
    modelModifiers: { default: () => ({}) }
  })

  const emit = defineEmits(['update:modelValue'])

  function emitValue(e) {
    let value = e.target.value
    if (props.modelModifiers.capitalize) {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }
    emit('update:modelValue', value)
  }
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

For v-model bindings with both argument and modifiers, the generated prop name will be `arg + "Modifiers"` . For example:

```html
<MyComponent v-model:title.capitalize="myText"> </MyComponent>
```

The corresponding declarations should be:

const props = defineProps(['title', 'titleModifiers'])
defineEmits(['update:title'])

console.log(props.titleModifiers) // { capitalize: true }

## 4 Fallthrough Attributes

### 4.1 Disabling Attribute Inheritance

If you do not want a component to automatically inherit attributes, you can set inheritAttrs: false in the component's options.

If using`<script setup>`, you will need to declare this option using a separate, normal `<script>` block:

```html
<script>
  // use normal <script> to declare options
  export default {
    inheritAttrs: false
  }
</script>

<script setup>
  // ...setup logic
</script>
```

The common scenario for disabling attribute inheritance is when attributes need to be applied to other elements besides the root node. By setting the inheritAttrs option to false, you can take full control over where the fallthrough attributes should be applied.

These fallthrough attributes can be accessed directly in template expressions as `$attrs`:

```html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

The `$attrs` object includes all attributes that are not declared by the component's props or emits options (e.g., class, style, v-on listeners, etc.).

Some notes:

Unlike props, fallthrough attributes preserve their original casing in JavaScript, so an attribute like foo-bar needs to be accessed as \$attrs['foo-bar'].

A v-on event listener like @click will be exposed on the object as a function under \$attrs.onClick.

Using our \<MyButton> component example from the previous section - sometimes we may need to wrap the actual \<button> element with an extra \<div> for styling purposes:

```html
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
```

We want all fallthrough attributes like class and v-on listeners to be applied to the inner \<button>, not the outer \<div>. We can achieve this with inheritAttrs: false and `v-bind="$attrs"`:

```html
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

Remember that v-bind without an argument binds all the properties of an object as attributes of the target element.

### 4.2 Attribute Inheritance on Multiple Root Nodes

Unlike components with a single root node, components with multiple root nodes do not have an automatic attribute fallthrough behavior. If \$attrs are not bound explicitly, a runtime warning will be issued.

```html
<CustomLayout id="custom-layout" @click="changeValue" />
```

If \<CustomLayout> has the following multi-root template, there will be a warning because Vue cannot be sure where to apply the fallthrough attributes:

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

The warning will be suppressed if \$attrs is explicitly bound:

```html
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

### 4.3 Accessing Fallthrough Attributes in JavaScript

If needed, you can access a component's fallthrough attributes in \<script setup> using the`useAttrs()` API:

```html
<script setup>
  import { useAttrs } from 'vue'

  const attrs = useAttrs()
</script>
```

If not using \<script setup>, attrs will be exposed as a property of the setup() context:

```typescript
export default {
  setup(props, ctx) {
    // fallthrough attributes are exposed as ctx.attrs
    console.log(ctx.attrs)
  }
}
```

<font color=#00dddd size=4>Note that although the attrs object here always reflect the latest fallthrough attributes, it isn't reactive (for performance reasons). You cannot use watchers to observe its changes. If you need reactivity, use a prop</font>. Alternatively, you can use onUpdated() to perform side effects with latest attrs on each update.

## 5. Slots

### 5.1 Render Scope

Slot content has access to the data scope of the parent component, because it is defined in the parent. For example:

<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
Here both {{ message }} interpolations will render the same content.

**Slot content does not have access to the child component's data**. As a rule, remember that:

> <font color=#dd0000 size=4>Everything in the parent template is compiled in parent scope; everything in the child template is compiled in the child scope.</font>

### 5.2 Named Slots

To pass a named slot, we need to use a `<template>` element with the v-slot directive, and then pass the name of the slot as an argument to v-slot:

```html
<BaseLayout>
  <template v-slot:header>
    <!-- content for the header slot -->
  </template>
</BaseLayout>
```

<font color=#00dddd size=4>v-slot has a dedicated shorthand #</font>, so `<template v-slot:header>` can be shortened to just `<template #header>`. Think of it as "render this template fragment in the child component's 'header' slot".

![](https://qiniu.espe.work/blog/20220712100426.png)

### 5.3 Dynamic Slot Names

Dynamic directive arguments also work on v-slot, allowing the definition of dynamic slot names:

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- with shorthand -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Do note the expression is subject to the syntax constraints of dynamic directive arguments.

### 5.4 Scoped Slots

In fact, we can do exactly that - we can pass attributes to a slot outlet just like passing props to a component:

```html
<!-- <MyComponent> template -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Receiving the slot props is a bit different when using a single default slot vs. using named slots. We are going to show how to receive props using a single default slot first, by using v-slot directly on the child component tag:

```html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![](https://qiniu.espe.work/blog/20220712101010.png)

The props passed to the slot by the child are available as the value of the corresponding v-slot directive, which can be accessed by expressions inside the slot.

You can think of <font color=#00dddd size=4>a scoped slot as a function being passed into the child component. The child component then calls it, passing props as arguments:</font>

```typescript
MyComponent({
  // passing the default slot, but as a function
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // call the slot function with props!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

In fact, <font color=#00dddd size=4>this is very close to how scoped slots are compiled</font> , and how you would use scoped slots in manual render functions.

Notice how v-slot="slotProps" matches the slot function signature. Just like with function arguments, we can use destructuring in v-slot:

```html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 5.5 Named Scoped Slots

Named scoped slots work similarly - slot props are accessible as the value of the v-slot directive: v-slot:name="slotProps". When using the shorthand, it looks like this:

```html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Passing props to a named slot:

```html
<slot name="header" message="hello"></slot>
```

Note the name of a slot won't be included in the props because it is reserved - so the resulting headerProps would be { message: 'hello' }.

### 5.6 Renderless Components

The <FancyList> use case we discussed above encapsulates both reusable logic (data fetching, pagination etc.) and visual output, while delegating part of the visual output to the consumer component via scoped slots.

If we push this concept a bit further, we can come up with components that only encapsulate logic and do not render anything by themselves - visual output is fully delegated to the consumer component with scoped slots. We call this type of component a Renderless Component.

An example renderless component could be one that encapsulates the logic of tracking the current mouse position:

<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>

## 6. Async Components

### 6.1 Basic Usage

In large applications, we may need to divide the app into smaller chunks and only <font color=#00dddd size=4>load a component from the server</font> when it's needed. To make that possible, Vue has a defineAsyncComponent function:

```typescript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...load component from server
    resolve(/_ loaded component _/)
  })
})
// ... use `AsyncComp` like a normal component
```

As you can see, defineAsyncComponent accepts a loader function that returns a Promise. The Promise's resolve callback should be called when you have retrieved your component definition from the server. You can also call reject(reason) to indicate the load has failed.

ES module dynamic import also returns a Promise, so most of the time we will use it in combination with defineAsyncComponent. Bundlers like Vite and webpack also support the syntax, so we can use it to import Vue SFCs:

```typescript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

The resulting AsyncComp is a wrapper component that only calls the loader function when it is actually rendered on the page. In addition, it will pass along any props and slots to the inner component, so you can use the async wrapper to seamlessly replace the original component while achieving lazy loading.

As with normal components, async components can be registered globally using `app.component()`:

```typescript
app.component(
  'MyComponent',
  defineAsyncComponent(() => import('./components/MyComponent.vue'))
)
```

They can also be defined directly inside their parent component:

```html
<script setup>
  import { defineAsyncComponent } from 'vue'

  const AdminPage = defineAsyncComponent(() =>
    import('./components/AdminPageComponent.vue')
  )
</script>

<template>
  <AdminPage />
</template>
```

### 6.2 Loading and Error States

Asynchronous operations inevitably involve loading and error states - defineAsyncComponent() supports handling these states via advanced options:

```typescript
const AsyncComp = defineAsyncComponent({
  // the loader function
  loader: () => import('./Foo.vue'),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

If a loading component is provided, it will be displayed first while the inner component is being loaded. There is a default 200ms delay before the loading component is shown - this is because on fast networks, an instant loading state may get replaced too fast and end up looking like a `flicker`.

If an error component is provided, it will be displayed when the Promise returned by the loader function is rejected. You can also specify a timeout to show the error component when the request is taking too long.
