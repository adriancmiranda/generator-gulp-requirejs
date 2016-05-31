module.exports = function(gulp, data, util){
	'use strict';
	
	// The classic and strict javascript lint-tool for gulp.js.
	// @see https://www.npmjs.com/package/gulp-jslint
	var jslint = require('gulp-jslint');

	return function(actionName, callback){
		var scripts = util.path.join(data.appDirs.scripts, '**/*.js');
		var tests = util.path.join(data.appDirs.tests, '**/*.js');
		return gulp.src([tests, scripts])
			.pipe(jslint())
			.pipe(jslint.reporter('default'))
		;
	};
};