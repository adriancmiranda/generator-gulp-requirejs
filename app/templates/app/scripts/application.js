/* global define */
define([
	'application/scope'<% if (includejQuery) { %>,
	'jquery'<% } %>
], function (scope<% if (includejQuery) { %>, $<% } %>) {
	'use strict';
	console.log('\'Allo \'Allo!', scope.id<% if (includejQuery) { %>, $.fn.jquery<% } %>);
	return scope;
});
