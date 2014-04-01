/* global define, window */
window.define([], function () {
    'use strict';
    var scope = window.YO = window.YO || {};
    scope.libs = scope.libs || {};
    scope.views = scope.views || {};
    scope.models = scope.models || {};
    scope.preload = scope.preload || [];
    scope.afterRender = scope.afterRender || [];
    scope.initializers = [];
    return scope;
});
