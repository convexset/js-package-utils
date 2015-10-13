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

	var fns = [
		addImmutablePropertyFunction,
		addImmutablePropertyValue,
		addImmutablePropertyObject,
		addImmutablePropertyArray,
		updateDefaultOptionsWithInput
	];
	var o = {};
	fns.forEach(function(fn) {
		addImmutablePropertyFunction(o, fn.name, fn);
	});

	return o;
})();