/* global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('gulp-requirejs generator', function(){
	beforeEach(function(done){
		helpers.testDirectory(path.join(__dirname, 'temp'), function(err){
			if(err) return done(err);
			var generators = [
				['../../generators/app'],
				['../../generators/back'],
				['../../generators/front']
			];
			this.app = helpers.createGenerator('gulp-requirejs:app', generators[0]);
			this.back = helpers.createGenerator('gulp-requirejs:back', generators[1]);
			this.front = helpers.createGenerator('gulp-requirejs:front', generators[2]);
			done();
		}.bind(this));
	});

	it('creates expected files', function(done){
		var expected = ['.editorconfig'];
		helpers.mockPrompt(this.app, { someOption:true });
		this.app.options['skip-install'] = true;
		this.app.run({}, function(){
			helpers.assertFile(expected);
			done();
		});
	});
});
