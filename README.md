# PackageUtils

`addImmutablePropertyValue(o, name, value)`

Adds a "value" property to an object via `Object.defineProperty`.

`addImmutablePropertyFunction(o, name, fn)`

Adds a "function" property to an object via `Object.defineProperty` (actually done the same way as for values).

`addImmutablePropertyObject(o, name, childObj)`

Adds an "object" property to an object via `Object.defineProperty`. Does not, however, protect sub-objects.

`addImmutablePropertyArray(o, name, arr)`

Adds an "array" property to an object via `Object.defineProperty`. Does not, however, protect object elements.

`updateDefaultOptionsWithInput(defaultOptions, inputOptions, [throwOnTypeMismatch = true])`

Uses the (top-level) properties of `defaultOptions` and fills in the gaps from `inputOptions` with basic type checking.