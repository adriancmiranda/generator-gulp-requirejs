/* global define */
define([], function () {
	'use strict';
	var scope = window.APP = (window.APP || {});
	scope.id = '<%= _.slugify(appname) %>';
	scope.libs = (scope.libs || {});
	scope.views = (scope.views || {});
	scope.models = (scope.models || {});
	scope.preload = (scope.preload || []);
	scope.afterRender = (scope.afterRender || []);
	scope.initializers = [];
	return scope;
});
