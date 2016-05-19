var should = require('chai').should();
var expect = require('chai').expect;
var PackageUtilities = require('../src');
var _ = require('underscore');

describe('some basic functionality', function() {
	it('addImmutablePropertyValue does as its name suggests', function() {
		var o = {};
		PackageUtilities.addImmutablePropertyValue(o, 'thing', 5);
		expect(o.thing).to.equal(5);
		expect(function() {
			o.thing = 10;	
		}).to.throw(TypeError);
		
		expect(o.thing).to.equal(5); // no change
	});

	it('addNonEnumerablePropertyValue does as its name suggests', function() {
		var o = {};
		PackageUtilities.addNonEnumerablePropertyValue(o, 'thing', 5);
		expect(o.thing).to.equal(5);
		expect(Object.keys(o).indexOf('thing')).to.equal(-1); // not enumerable
	});

	it('addImmutablePropertyFunction does as its name suggests', function() {
		var o = {};

		function strayFunctionToBeTranspiled(x = 1) {

		}

		var fn = function() {
			return 5;
		};
		var fn2 = function() {
			return 5;
		};
		PackageUtilities.addImmutablePropertyValue(o, 'thing', fn);
		expect(o.thing).to.equal(fn);

		expect(function() {
			o.thing = 10;
		}).to.throw(TypeError);
		expect(typeof o.thing).to.equal("function");
		expect(o.thing()).to.equal(5);

		expect(function() {
			o.thing = fn2;
		}).to.throw(TypeError);
		expect(o.thing).to.equal(fn); // no change
	});

	it('addPropertyGetter does as its name suggests', function() {
		var o = {};
		PackageUtilities.addPropertyGetter(o, 'getter', () => 11);
		expect(o.getter).to.equal(11);
		expect(function() {
			o.getter = 7;
		}).to.throw(TypeError);
	});

	it('addPropertyGetterAndSetter does as its name suggests', function() {
		var o = {};
		var _val = 10;
		PackageUtilities.addPropertyGetterAndSetter(o, 'getAndSet', {
			get: () => _val,
			set: function(v) {
				_val = v + 1;
			}
		});
		expect(o.getAndSet).to.equal(10);
		o.getAndSet = 10;
		expect(o.getAndSet).to.equal(11);
	});

	it('addImmutablePropertyObject does as its name suggests', function() {
		var o = {};
		var o1 = {
			a: 1
		};
		PackageUtilities.addImmutablePropertyObject(o, 'thing', o1);
		expect(_.isEqual(o.thing, {
			a: 1
		})).to.be.true; // key by key check

		o.thing.a = 5;
		expect(_.isEqual(o.thing, {
			a: 1
		})).to.be.true; // key by key check; no change
	});

	it('addImmutablePropertyArray does as its name suggests', function() {
		var o = {};
		var arr = _.range(5);
		PackageUtilities.addImmutablePropertyArray(o, 'thing', arr);
		expect(o.thing).to.not.equal(arr); // not the same array
		expect(_.isEqual(o.thing, _.range(5))).to.be.true;
		o.thing.push(100);
		expect(_.isEqual(o.thing, _.range(5))).to.be.true; // no change in stored array
	});

	it('isKindaUncloneable reports the right things', function() {
		expect(PackageUtilities.isKindaUncloneable({})).to.be.false;
		expect(PackageUtilities.isKindaUncloneable([1,2,3])).to.be.false;

		expect(PackageUtilities.isKindaUncloneable(null)).to.be.true;
		expect(PackageUtilities.isKindaUncloneable(void 0)).to.be.true;
		expect(PackageUtilities.isKindaUncloneable(() => 8)).to.be.true;

		expect(PackageUtilities.isKindaUncloneable(5)).to.be.true;
		expect(PackageUtilities.isKindaUncloneable(true)).to.be.true;
		expect(PackageUtilities.isKindaUncloneable("true")).to.be.true;
		expect(PackageUtilities.isKindaUncloneable(Symbol("true"))).to.be.true;
		expect(PackageUtilities.isKindaUncloneable(/ab+c/i)).to.be.true;
	});

	it('deepCopy and shallowCopy do as their names suggest', function() {
		var o = {
			a: 1,
			o: {
				x: 1,
				d: new Date(),
				arr: [],
				nullThing: null
			}
		};
		var o_s = PackageUtilities.shallowCopy(o);
		var o_d = PackageUtilities.deepCopy(o);
		
		expect(_.isEqual(o, o_s)).to.be.true;
		expect(_.isEqual(o, o_d)).to.be.true;

		o_s.o.y = 10;

		expect(_.isEqual(o.o, o_s.o)).to.be.true;
		expect(_.isEqual(o.o, o_d.o)).to.be.false;
	});

	it('updateDefaultOptionsWithInput does as its name suggests', function() {
		var o1 = PackageUtilities.updateDefaultOptionsWithInput({
			a: 1
		}, {});
		expect(_.isEqual(o1, {
			a: 1
		})).to.be.true; // use default

		var o2 = PackageUtilities.updateDefaultOptionsWithInput({
			a: 1
		}, {
			a: 2
		});
		expect(_.isEqual(o2, {
			a: 2
		})).to.be.true; // given, so not using default

		expect(function() {
			PackageUtilities.updateDefaultOptionsWithInput({
				a: 1
			}, {
				a: []
			}, true);
		}).to.throw({
			error: 'option-type-mismatch',
			option: 'a',
			input: [],
			default: 1
		});
	});

});