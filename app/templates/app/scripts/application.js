/* global define */
define([
	'application/scope',
	'jquery'
], function (scope, $) {
	'use strict';
	console.log('\'Allo \'Allo!', scope.id, $.fn.jquery);
	return scope;
});
