Package.describe({
	name: 'convexset:package-utils',
	version: '0.1.14',
	summary: 'Helpful tools for writing Meteor packages',
	git: 'https://github.com/convexset/meteor-package-utils',
	documentation: '../../README.md'
});

Npm.depends({
	'underscore': '1.8.3'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');
	api.use(['ecmascript', 'underscore']);
	api.addFiles(['package-utils.js']);
	api.export('PackageUtilities');
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use(['ecmascript', 'underscore', 'convexset:package-utils']);
	api.addFiles(['tests.js']);
});