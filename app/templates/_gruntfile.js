(function (loadGruntTasks, timeGrunt) {
	'use strict';
	//|**
	//| Gruntfile
	//|
	//| This file is the streaming build system
	//|
	//| .--------------------------------------------------------------.
	//| | NAMING CONVENTIONS:                                          |
	//| |--------------------------------------------------------------|
	//| | Singleton-literals and prototype objects | PascalCase        |
	//| |--------------------------------------------------------------|
	//| | Functions and public variables           | camelCase         |
	//| |--------------------------------------------------------------|
	//| | Global variables and constants           | UPPERCASE         |
	//| |--------------------------------------------------------------|
	//| | Private variables                        | _underscorePrefix |
	//| '--------------------------------------------------------------'
	//|
	//| Comment syntax for the entire project follows JSDoc:
	//| - http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
	//|
	//| For performance reasons we're only matching one level down:
	//| - 'test/spec/{,*/}*.js'
	//|
	//| Use this if you want to recursively match all subfolders:
	//| - 'test/spec/**/*.js'
	//|
	//'*/
	module.exports = function (grunt) {
		// show elapsed time at the end
		timeGrunt(grunt);
		// load all grunt tasks
		loadGruntTasks(grunt);
		// settings
		grunt.initConfig({
			// configurable paths
			// package (arbitrary non-task-specific properties).
			_: {
				pack: grunt.file.readJSON('package.json'),
				app: 'app',
				dist: 'dist'
			},
			// validate
			jsonlint: {
				package: {src: ['package.json'] },
				bowerrc: {src: ['.bowerrc'] },
				bower: {src: ['bower.json'] },
				csslint: {src: ['.csslintrc'] },
				jshint: {src: ['.jshintrc'] },
				jscs: {src: ['.jscs.json'] }
			},
			csslint: {
				options: {csslintrc: '.csslintrc'},
				styles: {src: [
					'<%=_.dist%>/styles/**/*.css',
					'<%=_.app%>/styles/**/*.css'
				]}
			},
			coffeelint: {
				scripts: {src: [
					'<%=_.app%>/scripts/**/*.coffee',
					'!<%=_.app%>/scripts/vendors/**/*.coffee',
					'test/spec/**/*.coffee'
				]}
			},
			jshint: {
				Gruntfile: 'Gruntfile.js',
				options: {
					jshintrc: '.jshintrc',
					reporter: require('jshint-stylish')
				},
				scripts: {src: [
					'<%=_.app%>/scripts/**/*.js',
					'!<%=_.app%>/scripts/vendors/**/*.js',
					'test/spec/**/*.js'
				]}
			},
			jscs: {
				Gruntfile: 'Gruntfile.js',
				options: {config: '.jscs.json'},
				scripts: {src: '<%=jshint.scripts.src%>'}
			}
		});
		// register tasks list
		grunt.registerTask('serve', function (target) {
			if (target === 'dist') {
				return grunt.task.run(['build']);
			}
			grunt.task.run([
			]);
		});
		grunt.registerTask('server', function () {
			grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
			grunt.task.run(['serve']);
		});
		grunt.registerTask('validate', [
			'jsonlint',
			'csslint',
			'coffeelint',
			'jshint',
			'jscs'
		]);
		grunt.registerTask('test', [
		]);
		grunt.registerTask('build', [
		]);
		grunt.registerTask('default', [
			'validate',
			'test',
			'build'
		]);
	};
}(require('load-grunt-tasks'), require('time-grunt')));
