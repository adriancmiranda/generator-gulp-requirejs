module.exports = function(gulp, data, util){
	'use strict';
	
	// A gulp plugin for processing files with ESLint.
	// @see https://www.npmjs.com/package/gulp-eslint
	var eslint = require('gulp-eslint');

	return function(actionName, callback){
		var scripts = util.path.join(data.appDirs.scripts, '**/*.js');
		var tests = util.path.join(data.appDirs.tests, '**/*.js');
		return gulp.src([tests, scripts])
			.pipe(eslint())
			.pipe(eslint.format())
		;
	};
};