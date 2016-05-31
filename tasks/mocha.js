module.exports = function(gulp, data, util){
	'use strict';

	// Run Mocha tests.
	// @see https://www.npmjs.com/package/gulp-mocha
	var mocha = require('gulp-mocha');

	return function(actionName, callback){
		var tests = util.path.join(data.appDirs.tests, '**/*.js');
		return gulp.src(tests, { read:false })
			.pipe(mocha({ reporter:'spec' }))
		;
	};
};
