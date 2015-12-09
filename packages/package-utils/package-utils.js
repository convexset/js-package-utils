/* global PackageUtilities: true */

PackageUtilities = (function() {
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

	function addPropertyGetterAndSetter(o, name, {
		get, set
	}, isEnumerable = true, isConfigurable = false) {
		Object.defineProperty(o, name, {
			get: get,
			set: set,
			enumerable: isEnumerable,
			configurable: isConfigurable
		});
	}

	function shallowCopy(o) {
		if (!_.isObject(o) || _.isFunction(o) || (o instanceof RegExp)) {
			return o;
		}
		if (_.isArray(o)) {
			return o.map(x => x);
		}
		if (o instanceof Date) {
			return new Date(o.getTime());
		}

		var _o = Object.create(Object.getPrototypeOf(o));
		_.forEach(Object.getOwnPropertyNames(o), function(k) {
			Object.defineProperty(_o, k, Object.getOwnPropertyDescriptor(o, k));
		});
		return _o;
	}

	function deepCopy(o, useCloneMethod = true) {
		if (!_.isObject(o) || _.isFunction(o) || (o instanceof RegExp)) {
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

		var _o = Object.create(Object.getPrototypeOf(o));
		_.forEach(Object.getOwnPropertyNames(o), function(k) {
			var propertyDescriptor = Object.getOwnPropertyDescriptor(o, k);
			if (typeof propertyDescriptor.value !== undefined) {
				propertyDescriptor.value = deepCopy(propertyDescriptor.value, useCloneMethod);
			}
			Object.defineProperty(_o, k, propertyDescriptor);
		});
		return _o;
	}

	function addImmutablePropertyObject(o, name, childObj, isEnumerable = true, isConfigurable = false) {
		var _obj = shallowCopy(childObj);
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
		var _arr = arr.map(x => x);
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
		var oProto = Object.getPrototypeOf(o);
		if (oProto) {
			_.forEach(oProto, function(item, name) {
				if (typeof _payload[name] === "undefined") {
					_payload[name] = item;
				}
			});
			getPrototypeElements(oProto, _payload);
		}
		return _payload;
	}

	function filterObject(o, oFilter, inPlace = false) {
		var ret = (inPlace) ? o : {};
		_.forEach(o, function(v, k) {
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
		var filteredDuck = filterObject(examinedDuck, sourceDuck);
		if (!_.isEqual(
			Object.keys(filteredDuck).sort(),
			Object.keys(sourceDuck).sort()
		)) {
			return false;
		}

		// reachable prototype member check
		var exProto = getPrototypeElements(examinedDuck);
		var srcProto = getPrototypeElements(sourceDuck);
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
		for (var k in sourceDuck) {
			if (sourceDuck.hasOwnProperty(k)) {
				if (!hasDuckTypeEquality(examinedDuck[k], sourceDuck[k], checkPrototypeChainEquality)) {
					return false;
				}
			}
		}

		return true;
	}

	function updateDefaultOptionsWithInput(defaultOptions, inputOptions, failOnTypeMismatch = true) {
		var myOptions = {};

		_.forEach(defaultOptions, function(opt, k) {
			var use_input = true;
			if ((typeof inputOptions[k] !== "undefined") && !hasDuckTypeEquality(inputOptions[k], opt)) {
				if (failOnTypeMismatch) {
					throw new Meteor.Error('option-type-mismatch', "Option: " + k + "; Input: " + inputOptions[k] + "; Default: " + opt);
				}
			}
			if (typeof inputOptions[k] === "undefined") {
				use_input = false;
			}
			myOptions[k] = use_input ? inputOptions[k] : opt;
		});
		return myOptions;
	}

	// Have to do things this way so minification does not mess up the function.name property
	var p_u = function PackageUtilities() {};
	var o = new p_u();
	_.forEach({
		"addImmutablePropertyFunction": addImmutablePropertyFunction,
		"addImmutablePropertyValue": addImmutablePropertyValue,
		"addNonEnumerablePropertyValue": addNonEnumerablePropertyValue,
		"addImmutablePropertyObject": addImmutablePropertyObject,
		"addImmutablePropertyArray": addImmutablePropertyArray,
		"addMutablePropertyObject": addMutablePropertyObject,
		"addMutablePropertyArray": addMutablePropertyArray,
		"addPropertyGetter": addPropertyGetter,
		"addPropertyGetterAndSetter": addPropertyGetterAndSetter,
		"updateDefaultOptionsWithInput": updateDefaultOptionsWithInput,
		"hasDuckTypeEquality": hasDuckTypeEquality,
		"getPrototypeElements": getPrototypeElements,
		"filterObject": filterObject,
		"shallowCopy": shallowCopy,
		"deepCopy": deepCopy,
	}, function(fn, name) {
		addImmutablePropertyFunction(o, name, fn);
	});

	return o;
})();