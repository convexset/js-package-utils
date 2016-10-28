const underscore = require('underscore');
module.exports = factoryPackageUtilities(underscore);

function factoryPackageUtilities(_) {
	// function isUndefined(o) {
	// 	return typeof o === 'undefined';
	// }

	function addImmutablePropertyValue(o, name, value, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			value: value,
			writeable: false,
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addNonEnumerablePropertyValue(o, name, value, isWritable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			value: value,
			writeable: isWritable,
			enumerable: false,
			configurable: isConfigurable
		});
	}

	function addImmutablePropertyFunction(o, name, func, isEnumerable = false, isConfigurable = false) {
		Object.defineProperty(o, name, {
			value: func,
			writeable: false,
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addPropertyGetter(o, name, func, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			get: func,
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addPropertyGetterAndSetter(o, name, getAndSet, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			get: getAndSet.get,
			set: getAndSet.set,
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function isKindaUncloneable(o) {
		return ['Null', 'Undefined', 'Function', 'GeneratorFunction', 'Boolean', 'String', 'Number', 'RegExp', 'Symbol']
			.filter(t => Object.prototype.toString.call(o) === `[object ${t}]`)
			.length > 0;
	}

	function shallowCopy(o) {
		// types to "just return"
		if (isKindaUncloneable(o)) {
			return o;
		}
		if (_.isArray(o)) {
			return o.map(x => x);
		}
		if (o instanceof Date) {
			return new Date(o.getTime());
		}

		const _o = Object.create(Object.getPrototypeOf(o));
		_.forEach(Object.getOwnPropertyNames(o), k => Object.defineProperty(_o, k, Object.getOwnPropertyDescriptor(o, k)));
		return _o;
	}

	function deepCopy(o, useCloneMethod = true) {
		// types to "just return"
		if (isKindaUncloneable(o)) {
			return o;
		}
		if (_.isArray(o)) {
			return o.map(x => deepCopy(x, useCloneMethod));
		}
		if (o instanceof Date) {
			return new Date(o.getTime());
		}

		if (useCloneMethod && _.isFunction(o.clone)) {
			return o.clone();
		}

		const _o = Object.create(Object.getPrototypeOf(o));
		_.forEach(Object.getOwnPropertyNames(o), k => {
			const propertyDescriptor = Object.getOwnPropertyDescriptor(o, k);
			if (typeof propertyDescriptor.value !== 'undefined') {
				propertyDescriptor.value = deepCopy(propertyDescriptor.value, useCloneMethod);
			}
			Object.defineProperty(_o, k, propertyDescriptor);
		});
		return _o;
	}

	function addImmutablePropertyObject(o, name, childObj, isEnumerable = true, isConfigurable = false) {
		const _obj = shallowCopy(childObj);
		Object.defineProperty(o, name, {
			get: () => shallowCopy(_obj),
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addMutablePropertyObject(o, name, _obj, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			get: () => shallowCopy(_obj),
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addImmutablePropertyArray(o, name, arr, isEnumerable = true, isConfigurable = false) {
		const _arr = arr.map(x => x);
		Object.defineProperty(o, name, {
			get: () => _arr.map(x => x),
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function addMutablePropertyArray(o, name, arr, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			get: () => arr.map(x => x),
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function getPrototypeElements(o, _payload = {}) {
		const oProto = Object.getPrototypeOf(o);
		if (oProto) {
			_.forEach(oProto, (item, name) => {
				if (typeof _payload[name] === 'undefined') {
					_payload[name] = item;
				}
			});
			getPrototypeElements(oProto, _payload);
		}
		return _payload;
	}

	function filterObject(o, oFilter, inPlace = false) {
		const ret = inPlace ? o : {};
		_.forEach(o, (v, k) => {
			if (inPlace) {
				if (!oFilter.hasOwnProperty(k)) {
					delete ret[k];
				}
			} else {
				if (oFilter.hasOwnProperty(k)) {
					ret[k] = v;
				}
			}
		});
		return ret;
	}

	function hasDuckTypeEquality(examinedDuck, sourceDuck, checkPrototypeChainEquality = false) {
		if (!_.isObject(sourceDuck)) {
			return typeof examinedDuck === typeof sourceDuck;
		}
		if (_.isArray(sourceDuck) && _.isArray(examinedDuck)) {
			return true;
		}

		// has keys of source object
		const filteredDuck = filterObject(examinedDuck, sourceDuck);
		if (!_.isEqual(
				Object.keys(filteredDuck).sort(),
				Object.keys(sourceDuck).sort()
			)) {
			return false;
		}

		// reachable prototype member check
		const exProto = getPrototypeElements(examinedDuck);
		const srcProto = getPrototypeElements(sourceDuck);
		if (!_.isEqual(
				Object.keys(exProto).sort(),
				Object.keys(srcProto).sort()
			)) {
			return false;
		}

		// reachable prototype member equality check
		if (checkPrototypeChainEquality) {
			if (!_.isEqual(
					filterObject(exProto, srcProto),
					srcProto
				)) {
				return false;
			}
		}

		// deep type check
		// note that keys already match
		for (const k in sourceDuck) {
			if (sourceDuck.hasOwnProperty(k)) {
				if (!hasDuckTypeEquality(examinedDuck[k], sourceDuck[k], checkPrototypeChainEquality)) {
					return false;
				}
			}
		}

		return true;
	}

	function updateDefaultOptionsWithInput(defaultOptions, inputOptions, failOnTypeMismatch = true) {
		const myOptions = {};

		_.forEach(defaultOptions, (opt, k) => {
			let useInput = true;
			if ((typeof inputOptions[k] !== 'undefined') && !hasDuckTypeEquality(inputOptions[k], opt)) {
				if (failOnTypeMismatch) {
					const err = new Error('option-type-mismatch');
					err.details = {
						option: k,
						input: inputOptions[k],
						default: opt
					};
					throw err;
				}
			}
			if (typeof inputOptions[k] === 'undefined') {
				useInput = false;
			}
			myOptions[k] = useInput ? inputOptions[k] : opt;
		});
		return myOptions;
	}

	// Have to do things this way so minification does not mess up the function.name property
	const _pu = function PackageUtilities() {};
	const o = new _pu();
	_.forEach({
		'addImmutablePropertyFunction': addImmutablePropertyFunction,
		'addImmutablePropertyValue': addImmutablePropertyValue,
		'addNonEnumerablePropertyValue': addNonEnumerablePropertyValue,
		'addImmutablePropertyObject': addImmutablePropertyObject,
		'addImmutablePropertyArray': addImmutablePropertyArray,
		'addMutablePropertyObject': addMutablePropertyObject,
		'addMutablePropertyArray': addMutablePropertyArray,
		'addPropertyGetter': addPropertyGetter,
		'addPropertyGetterAndSetter': addPropertyGetterAndSetter,
		'updateDefaultOptionsWithInput': updateDefaultOptionsWithInput,
		'hasDuckTypeEquality': hasDuckTypeEquality,
		'getPrototypeElements': getPrototypeElements,
		'filterObject': filterObject,
		'shallowCopy': shallowCopy,
		'deepCopy': deepCopy,
		'isKindaUncloneable': isKindaUncloneable,
		// undocumented
		'_filterObject': filterObject,
		'_getPrototypeElements': getPrototypeElements
	}, (fn, name) => {
		addImmutablePropertyFunction(o, name, fn);
	});

	return o;
}
