# PackageUtils

## Install

This is available as [`convexset:package-utils`](https://atmospherejs.com/convexset/package-utils) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:package-utils`.)

## Usage

`addImmutablePropertyValue(o, name, value)`

Adds a "value" property to an object via `Object.defineProperty`.

`addPropertyGetter(o, name, fn)`

Adds a getter.

`addImmutablePropertyFunction(o, name, fn)`

Adds a "function" property to an object via `Object.defineProperty` (actually done the same way as for values).

`addImmutablePropertyObject(o, name, childObj)`

Adds an "object" property to an object via `Object.defineProperty`. Does not, however, protect sub-objects.

`addMutablePropertyObject(o, name, childObj)`

Adds an "object" property to an object via `Object.defineProperty`. The underlying object can be mutated.

`addImmutablePropertyArray(o, name, arr)`

Adds an "array" property to an object via `Object.defineProperty`. Does not, however, protect object elements.

`addMutablePropertyArray(o, name, arr)`

Adds an "array" property to an object via `Object.defineProperty`. The underlying array can be mutated.

`updateDefaultOptionsWithInput(defaultOptions, inputOptions, [throwOnTypeMismatch = true])`

Uses the (top-level) properties of `defaultOptions` and fills in the gaps from `inputOptions` with basic type checking.