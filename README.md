# PackageUtilities

**Consider this package to be deprecated. Use the version [on npm](https://www.npmjs.com/package/package-utils).**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
  - [Meteor Package](#meteor-package)
  - [npm Package](#npm-package)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

### Meteor Package

This is available as [`convexset:package-utils`](https://atmospherejs.com/convexset/package-utils) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:package-utils`.)

### npm Package

... also available as [`package-utils`](https://www.npmjs.com/package/package-utils) on [npm](https://www.npmjs.com/). (Install with `npm install package-utils`.)

## Usage

`addImmutablePropertyValue(o, name, value, isEnumerable = true, isConfigurable = false)`

Adds a "value" property to an object via `Object.defineProperty`.

`addPropertyGetter(o, name, fn, isEnumerable = true, isConfigurable = false)`

Adds a getter.

`addPropertyGetterAndSetter(o, name, {get, set}, isEnumerable = true, isConfigurable = false)`

Adds a getter and setter. For example:
```javascript
var o = {_x: 100};
PackageUtilities.addPropertyGetterAndSetter(o, 'noisy_x', {
    get: function() {
        return this._x * (1 + 0.01 * Math.random());
    },
    set: function(v) {
        this._x = v * (1 + 0.01 * Math.random());
    }
});
```

`addNonEnumerablePropertyValue(o, name, value, isWritable = false, isConfigurable = false)`

Adds a non-enumerable property.

`addImmutablePropertyFunction(o, name, fn, isEnumerable = false, isConfigurable = false)`

Adds a "function" property to an object via `Object.defineProperty`. By default, functions are added as non-enumerable properties.

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

`shallowCopy(o)`

Does a "type-respecting" shallow copy, including non-enumerable properties, respecting property descriptors.

**Note:** Because functions are returned as is, functions with explicit bindings may not work as expected.

`deepCopy(o)`

Does a "type-respecting" deep copy, including non-enumerable properties, respecting property descriptors.

**Note:** Because functions are returned as is, functions with explicit bindings may not work as expected.