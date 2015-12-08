# PackageUtilities

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

This is available as [`convexset:package-utils`](https://atmospherejs.com/convexset/package-utils) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:package-utils`.)

## Usage

`addImmutablePropertyValue(o, name, value, isEnumerable = true, isConfigurable = false)`

Adds a "value" property to an object via `Object.defineProperty`.

`addPropertyGetter(o, name, fn, isEnumerable = true, isConfigurable = false)`

Adds a getter.

`addImmutablePropertyFunction(o, name, fn, isEnumerable = false, isConfigurable = false)`

Adds a "function" property to an object via `Object.defineProperty` (actually done the same way as for values).

`addImmutablePropertyObject(o, name, childObj, isEnumerable = true, isConfigurable = false)`

Adds an "object" property to an object via `Object.defineProperty`. Does not, however, protect members that are objects.

`addMutablePropertyObject(o, name, childObj, isEnumerable = true, isConfigurable = false)`

Adds an "object" property to an object via `Object.defineProperty`. The underlying object can be mutated, but not through the property. Does not, however, protect members that are objects.

`addImmutablePropertyArray(o, name, arr, isEnumerable = true, isConfigurable = false)`

Adds an "array" property to an object via `Object.defineProperty`. Does not, however, protect array elements.

`addMutablePropertyArray(o, name, arr, isEnumerable = true, isConfigurable = false)`

Adds an "array" property to an object via `Object.defineProperty`. The underlying array can be directed mutated, but changes made to the property does not affect the underlying array. Does not, however, protect array elements.

`updateDefaultOptionsWithInput(defaultOptions, inputOptions, failOnTypeMismatch = true)`

Uses the (top-level) properties of `defaultOptions` and fills in the gaps from `inputOptions` with basic type checking.

`hasDuckTypeEquality(examinedDuck, sourceDuck, checkPrototypeChainEquality = false)`

Checks for "duck-type" equality. If `checkPrototypeChainEquality` is set to `true`, there will be an additional check that prototype chain elements point to the same functions.

`getPrototypeElements(o)`

Gets prototype elements of `o`.

`filterObject(o, oFilter, inPlace = false)`

Filters object `o` based on existing keys of `oFilter`. If `inPlace` is set to `true`, key-value pairs in `o` absent from `oFilter` will be deleted from `o`. Returns the resulting object.