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

This is called "<font color=gree size=4>`type-based declaration`</font>". The compiler will try to do its best to `infer` the equivalent runtime options based on the type argument. In this case, our second example compiles into the exact same runtime options as the first example.

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
