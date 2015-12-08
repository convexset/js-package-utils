Package.describe({
	name: 'convexset:package-utils',
	version: '0.1.6',
	summary: 'Helpful tools for writing Meteor packages',
	git: 'https://github.com/convexset/meteor-package-utils',
	documentation: '../../README.md'
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