/* global PackageUtilities: true */

PackageUtilities = (function() {
	function addImmutablePropertyValue(o, name, value) {
		Object.defineProperty(o, name, {
			value: value,
			writeable: false,
			enumerable: true,
			configurable: false
		});
	}

	function addImmutablePropertyFunction(o, name, func) {
		Object.defineProperty(o, name, {
			value: func,
			writeable: false,
			enumerable: true,
			configurable: false
		});
	}

	function addPropertyGetter(o, name, func) {
		Object.defineProperty(o, name, {
			get: func,
			enumerable: true,
			configurable: false
		});
	}

	function addImmutablePropertyObject(o, name, childObj) {
		var _obj = _.extend({}, childObj);
		Object.defineProperty(o, name, {
			get: function() {
				return _.extend({}, _obj);
			},
			enumerable: true,
			configurable: false
		});
	}

	function addMutablePropertyObject(o, name, _obj) {
		Object.defineProperty(o, name, {
			get: function() {
				return _.extend({}, _obj);
			},
			enumerable: true,
			configurable: false
		});
	}

	function addImmutablePropertyArray(o, name, arr) {
		var _arr = arr.map(function(x) {
			return x;
		});
		Object.defineProperty(o, name, {
			get: function() {
				return _arr.map(function(x) {
					return x;
				});
			},
			enumerable: true,
			configurable: false
		});
	}

	function addMutablePropertyArray(o, name, arr) {
		Object.defineProperty(o, name, {
			get: function() {
				return arr.map(function(x) {
					return x;
				});
			},
			enumerable: true,
			configurable: false
		});
	}

	function updateDefaultOptionsWithInput(defaultOptions, inputOptions, throwOnTypeMismatch) {
		var myOptions = {};

		if (typeof throwOnTypeMismatch === "undefined") {
			throwOnTypeMismatch = true;
		}

		for (var k in defaultOptions) {
			if (defaultOptions.hasOwnProperty(k)) {
				var use_input = true;
				if ((typeof inputOptions[k] !== "undefined") && (typeof inputOptions[k] !== typeof defaultOptions[k])) {
					if (throwOnTypeMismatch) {
						throw new Meteor.Error('option-type-mismatch', 'Option: ' + k + ' (type of default: ' + (typeof defaultOptions[k]) + ')');
					}
					use_input = false;
				}
				if (typeof inputOptions[k] === "undefined") {
					use_input = false;
				}
				myOptions[k] = use_input ? inputOptions[k] : defaultOptions[k];
			}
		}
		return myOptions;
	}

	// Have to do things this way so minification does not mess up the function.name property
	var p_u = function PackageUtilities() {};
	var o = new p_u();
	_.forEach({
		"addImmutablePropertyFunction": addImmutablePropertyFunction,
		"addImmutablePropertyValue": addImmutablePropertyValue,
		"addImmutablePropertyObject": addImmutablePropertyObject,
		"addImmutablePropertyArray": addImmutablePropertyArray,
		"addMutablePropertyObject": addMutablePropertyObject,
		"addMutablePropertyArray": addMutablePropertyArray,
		"addPropertyGetter": addPropertyGetter,
		"updateDefaultOptionsWithInput": updateDefaultOptionsWithInput,
	}, function(fn, name) {
		addImmutablePropertyFunction(o, name, fn);
	});
	
	return o;
})();