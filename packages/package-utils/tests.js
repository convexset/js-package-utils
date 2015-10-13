/* global Tinytest: true */
/* global PackageUtilities: true */

Tinytest.add('addImmutablePropertyValue', function(test) {
	var o = {};
	PackageUtilities.addImmutablePropertyValue(o, 'thing', 5);
	test.isTrue(_.isEqual(o.thing, 5), 'addImmutablePropertyValue');
	o.thing = 10;
	test.isTrue(_.isEqual(o.thing, 5), 'addImmutablePropertyValue (immutable)');
});

Tinytest.add('addImmutablePropertyFunction', function(test) {
	var o = {};
	var fn = function() {
		return 5;
	};
	PackageUtilities.addImmutablePropertyValue(o, 'thing', fn);
	test.isTrue(_.isEqual(o.thing, fn), 'addImmutablePropertyFunction');
	o.thing = 10;
	test.isTrue(_.isEqual(typeof o.thing, "function"), 'addImmutablePropertyFunction (immutable 1)');
	test.isTrue(_.isEqual(o.thing(), 5), 'addImmutablePropertyFunction (immutable 2)');
});

Tinytest.add('addImmutablePropertyObject', function(test) {
	var o = {};
	var o1 = {
		a: 1
	};
	PackageUtilities.addImmutablePropertyObject(o, 'thing', o1);
	test.isTrue(_.isEqual(o.thing, {
		a: 1
	}), 'addImmutablePropertyObject');
	o.thing.a = 5;
	test.isTrue(_.isEqual(o.thing, {
		a: 1
	}), 'addImmutablePropertyObject (immutable)');

	PackageUtilities.addImmutablePropertyObject(o, 'thing2', {a: {a:1}, b: new Date()});
});

Tinytest.add('addImmutablePropertyArray', function(test) {
	var o = {};
	var arr = _.range(5);
	PackageUtilities.addImmutablePropertyArray(o, 'thing', arr);
	test.isTrue(_.isEqual(o.thing, _.range(5)), 'addImmutablePropertyArray');
	o.thing.push(100);
	test.isTrue(_.isEqual(o.thing, _.range(5)), 'addImmutablePropertyArray (immutable)');
});

Tinytest.add('updateDefaultOptionsWithInput', function(test) {
	var o1 = PackageUtilities.updateDefaultOptionsWithInput({
		a: 1
	}, {});
	test.isTrue(_.isEqual(o1, {
		a: 1
	}), 'updateDefaultOptionsWithInput: 1');

	var o2 = PackageUtilities.updateDefaultOptionsWithInput({
		a: 1
	}, {
		a: 2
	});
	test.isTrue(_.isEqual(o2, {
		a: 2
	}), 'updateDefaultOptionsWithInput: 2');

	var o3 = PackageUtilities.updateDefaultOptionsWithInput({
		a: 1
	}, {
		a: []
	}, false);
	test.isTrue(_.isEqual(o3, {
		a: 1
	}), 'updateDefaultOptionsWithInput: 3');

	test.throws(function() {
		PackageUtilities.updateDefaultOptionsWithInput({
			a: 1
		}, {
			a: []
		});
	}, function(x) {
		return x instanceof Meteor.Error;
	});
});