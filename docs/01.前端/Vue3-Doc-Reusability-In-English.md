> The way to learn something well is to read the official documentation

## 1. Composables

### 1.1 What is a "Composable"?

In the context of Vue applications, a "composable" is a function that leverages Vue Composition API to encapsulate and reuse stateful logic.

When building frontend applications, we often have the need to reuse logic for common tasks. For example, we may need to format dates in many places, so we extract a reusable function for that. This formatter function encapsulates stateless logic: it takes some input and immediately returns expected output. There are many libraries out there for reusing stateless logic - for example lodash and date-fns, which you may have heard of.

In comparison, stateful logic involves managing state that changes over time. A simple example would be tracking the current position of the mouse on a page. In real world scenarios, it could also be more complex logic such as touch gestures or connection status to a database.
