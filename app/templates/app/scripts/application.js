/* global define */
define([
	'application/scope'<% if (includejQuery) { %>,
	'jquery'<% } else { if (includeSizzle) { %>,
	'sizzle'<% }} %>
], function (scope<% if (includejQuery || includeSizzle) { %>, $<% } %>) {
	'use strict';<% if (includejQuery) { %>
	console.log('\'Allo \'Allo!', scope.id, $.fn.jquery);<% } else { if (includeSizzle) { %>
	console.log('\'Allo \'Allo!', scope.id, $);<% }} %>
	return scope;
});
