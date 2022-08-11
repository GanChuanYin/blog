---
title: Vue3-Doc-Typescript
date: 2022-07-25 09:51:12
permalink: /pages/a5a23c/
categories:
  - Vue
tags:
  - 
---
## 1. TypeScript with Composition API

### 1.1 Typing Component Props

Using `<script setup>`
When using `<script setup>`, the defineProps() macro supports inferring the props types based on its argument:

```html
<script setup lang="ts">
  const props = defineProps({
    foo: { type: String, required: true },
    bar: Number
  })

  props.foo // string
  props.bar // number | undefined
</script>
```

This is called "runtime declaration", because the argument passed to defineProps() will be used as the runtime props option.

However, it is usually more straightforward to define props with pure types via a generic type argument:

```html
<script setup lang="ts">
  const props = defineProps<{
    foo: string
    bar?: number
  }>()
</script>
```

This is called "<font color=#3498db size=4>`type-based declaration`</font>". The compiler will try to do its best to `infer` the equivalent runtime options based on the type argument. In this case, our second example compiles into the exact same runtime options as the first example.

You can use either type-based declaration OR runtime declaration, but you cannot use both at the same time.

We can also move the props types into a separate interface:

```html
<script setup lang="ts">
  interface Props {
    foo: string
    bar?: number
  }

  const props = defineProps<Props>()
</script>
```

### 1.2 Typing Component Emits

In `<script setup>`, the emit function can also be typed using either runtime declaration OR type declaration:

```html
<script setup lang="ts">
  // runtime
  const emit = defineEmits(['change', 'update'])

  // type-based
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()
</script>
```

The type argument should be a type literal with Call Signatures. The type literal will be used as the type of the returned `emit` function. As we can see, the type declaration gives us much finer-grained control over the type constraints of emitted events.

### 1.3 Typing ref()

Refs infer the type from the initial value:

```javascript
import { ref } from 'vue'

// inferred type: Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

Sometimes we may need to specify complex types for a ref's inner value. We can do that by using the Ref type:

```javascript
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Or, by passing a generic argument when calling `ref()` to override the default inference:

```javascript
// resulting type: Ref<string | number>
const year = (ref < string) | (number > '2020')

year.value = 2020 // ok!
```

If you specify a generic type argument but omit the initial value, the resulting type will be a union type that includes `undefined`:

```javascript
// inferred type: Ref<number | undefined>
const n = ref<number>()
```

### 1.3 Typing reactive()

reactive() also implicitly infers the type from its argument:

```javascript
import { reactive } from 'vue'

// inferred type: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

To explicitly type a reactive property, we can use interfaces:

```javascript
import { reactive } from 'vue'

interface Book {
title: string
year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

> It's not recommended to use the generic argument of reactive() because the returned type, which handles nested ref unwrapping, is different from the generic argument type.

### 1.4 Typing computed()

computed() infers its type based on the getter's return value:

```javascript
import { ref, computed } from 'vue'

const count = ref(0)

// inferred type: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

You can also specify an explicit type via a generic argument:

```javascript
const double =
  computed <
  number >
  (() => {
    // type error if this doesn't return a number
  })
```

### 1.5 Typing Event Handlers

When dealing with native DOM events, it might be useful to type the argument we pass to the handler correctly. Let's take a look at this example:

```html
<script setup lang="ts">
  function handleChange(event) {
    // `event` implicitly has `any` type
    console.log(event.target.value)
  }
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Without type annotation, the event argument will implicitly have a type of any. This will also result in a TS error if `"strict": true` or `"noImplicitAny": true` are used in `tsconfig.json`. It is therefore recommended to explicitly annotate the argument of event handlers. In addition, you may need to explicitly cast properties on `event`:

```javascript
function handleChange(event: Event) {
console.log((event.target as HTMLInputElement).value)
}
```

### 1.6 Typing Template Refs

Template refs should be created with an explicit generic type argument and an initial value of null:

```html
<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const el = ref<HTMLInputElement | null>(null)

  onMounted(() => {
    el.value?.focus()
  })
</script>

<template>
  <input ref="el" />
</template>
```

Note that for strict type safety, it is necessary to use optional chaining or type guards when accessing `el.value`. This is because the initial ref value is `null` until the component is mounted, and it can also be set to `null` if the referenced element is unmounted by `v-if`.

### 1.7 Typing Component Template Refs

Sometimes you might need to annotate a template ref for a child component in order to call its public method. For example, we have a MyModal child component with a method that opens the modal:

```html
<!-- MyModal.vue -->
<script setup lang="ts">
  import { ref } from 'vue'

  const isContentShown = ref(false)
  const open = () => (isContentShown.value = true)

  defineExpose({
    open
  })
</script>
```

In order to get the instance type of MyModal, we need to first get its type via typeof, then use TypeScript's built-in InstanceType utility to extract its instance type:

```html
<!-- App.vue -->
<script setup lang="ts">
  import MyModal from './MyModal.vue'

  const modal = ref<InstanceType<typeof MyModal> | null>(null)

  const openModal = () => {
    modal.value?.open()
  }
</script>
```

Note if you want to use this technique in TypeScript files instead of Vue SFCs, you need to enable Volar's Takeover Mode.
