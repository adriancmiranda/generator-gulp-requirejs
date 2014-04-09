(function (gulp, gulpLoadPlugins) {
	'use strict';
	//|**
	//|
	//| Gulpfile
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
	var $ = gulpLoadPlugins({ pattern: '*', lazy: true }),
		_ = { app: 'app', dist: 'dist' };

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ jsonlint
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('jsonlint', function() {
		return gulp.src([
			'package.json',
			'bower.json',
			'.bowerrc',
			'.jshintrc',
			'.jscs.json'
		])
		.pipe($.plumber())
		.pipe($.jsonlint()).pipe($.jsonlint.reporter())
		.pipe($.notify({
			message: '<%= options.date %> ✓ jsonlint: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ coffeelint
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('coffeelint', function() {
		return gulp.src([
			_.app + '/scripts/**/*.coffee',
			'!' + _.app + '/scripts/vendor/**/*.coffee'
		])
		.pipe($.plumber())
		.pipe($.coffeelint())
		.pipe($.coffeelint.reporter())
		.pipe($.notify({
			message: '<%= options.date %> ✓ coffeelint: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ jshint
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('jshint', function() {
		return gulp.src([
			'gulpfile.js',
			_.app + '/scripts/**/*.js',
			'!' + _.app + '/scripts/vendor/**/*.js',
			'test/spec/{,*/}*.js'
		])
		.pipe($.plumber())
		.pipe($.jshint('.jshintrc')).pipe($.jshint.reporter('default'))
		.pipe($.jscs())
		.pipe($.notify({
			message: '<%= options.date %> ✓ jshint: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ mocha
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('mocha', function() {
		return gulp.src('test/*.js').pipe($.plumber())
		.pipe($.mocha({ reporter: 'list' }));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ coffee
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('coffees', ['coffeelint'], function() {
		return gulp.src([
			_.app + '/scripts/**/*.coffee',
			'!' + _.app + '/scripts/vendor/**/*.coffee'
		])
		.pipe($.plumber())
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ requirejs
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('requirejs', ['coffees', 'jshint'], function() {
		$.requirejs({
			baseUrl: _.app + '/scripts',
			optimize: 'none',
			include: ['requirejs', 'config'],
			mainConfigFile: _.app + '/scripts/config.js',
			out: 'body.js',
			preserveLicenseComments: true,
			useStrict: true,
			wrap: true
		})
		.pipe($.plumber()).pipe(gulp.dest(_.dist + '/scripts')).pipe($.size())
		.pipe($.notify({
			message: '<%= options.date %> ✓ requirejs: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ scripts
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('scripts', ['requirejs'], function() {
		return gulp.src([
			_.app + '/scripts/**/*.js',
			'!' + _.app + '/scripts/vendor/**/*.js'
		]).pipe($.plumber()).pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ scripts: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ styles
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('styles', function() {
		return gulp.src(_.app + '/styles/theme.scss').pipe($.rubySass({
			loadPath: [_.app + '/scripts/vendor'],
			require: ['sass-css-importer'], // @require https://github.com/chriseppstein/sass-css-importer
			style: 'expanded',
			compass: false, // @deprecated only work's with sass (3.2.18) or earlier
			noCache: false
		}).on('error', $.util.log)).pipe($.plumber())
		.pipe($.autoprefixer('last 1 version', '> 1%', 'ie 8'))
		.pipe(gulp.dest(_.app + '/styles'))
		.pipe($.size())
		.pipe($.notify({
			message: '<%= options.date %> ✓ styles: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ svg
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('svg', function() {
		return gulp.src([
			_.app + '/images/**/*.svg',
			_.app + '/styles/**/*.svg'
		])
		.pipe($.plumber())
		.pipe($.svgmin([{ removeDoctype: false }, { removeComments: false }]))
		.pipe(gulp.dest(_.dist + '/images')).pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ svg: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ images
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('images', function() {
		gulp.src(_.app + '/*.{png,jpg,jpeg,gif,ico}').pipe(gulp.dest(_.dist));
		return gulp.src([
			_.app + '/images/**/*.{png,jpg,jpeg,gif,ico}'
		]).pipe($.plumber()).pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))).pipe(gulp.dest(_.dist + '/images')).pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ images: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ html
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('html', ['styles', 'scripts'], function() {
		var js = $.filter('**/*.js'), css = $.filter('**/*.css');
		gulp.src(_.app + '/*.txt').pipe(gulp.dest(_.dist));
		return gulp.src([_.app + '/*.html']).pipe($.plumber())
		.pipe($.useref.assets())
		.pipe(js)
		.pipe($.uglify())
		.pipe(js.restore())
		.pipe(css)
		.pipe($.csso())
		.pipe(css.restore())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest(_.dist))
		.pipe($.size())
		.pipe($.notify({
			message: '<%= options.date %> ✓ html: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ bower (Inject Bower components)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('wiredep', function() {
		gulp.src(_.app + '/styles/*.{sass,scss}').pipe($.wiredep.stream({
			directory: _.app + '/scripts/vendor',
			ignorePath: _.app + '/scripts/vendor/'
		})).pipe(gulp.dest(_.app + '/styles'));
		gulp.src(_.app + '/*.html').pipe($.wiredep.stream({
			directory: _.app + '/scripts/vendor',
			ignorePath: _.app + '/'
		})).pipe(gulp.dest(_.app));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ connect
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('connect', $.connect.server({
		root: [_.app],
		livereload: true,
		port: 9000
	}));

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ server
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('server', ['connect', 'styles'], function() {
		gulp.start('localhost');
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ watch
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('watch', ['server'], function() {
		// Watch for changes in `app` dir
		$.watch({ glob: [
			_.app + '/*.{html,txt}',
			_.app + '/styles/**/*.{sass,scss,css}',
			_.app + '/scripts/**/*.js',
			_.app + '/images/**/*.{png,jpg,jpeg,gif,ico}',
			'!' + _.app + '/scripts/vendor/**/*.js'
		] }, function(files) {
			return files.pipe($.plumber()).pipe($.connect.reload());
		});

		// Watch style files
		$.watch({ glob: [_.app + '/styles/**/*.{sass,scss}'] }, function() {
			gulp.start('styles');
		});

		// Watch script files
		$.watch({ glob: [_.app + '/scripts/**/*.js', '!' + _.app + '/scripts/vendor/**/*.js'] }, function() {
			gulp.start('scripts');
		});

		// Watch image files
		$.watch({ glob: [_.app + '/images/**/*.{png,jpg,jpeg,gif,ico}'] }, function() {
			gulp.start('images');
		});

		// Watch bower files
		$.watch({ glob: 'bower.json' }, function() {
			gulp.start('wiredep');
		});
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ clean
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('clean', [], function() {
		var stream = gulp.src([
			_.dist + '/images',
			_.dist + '/scripts',
			_.dist + '/styles'
		], { read: false });
		return stream.pipe($.clean());
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ environ
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('localhost', function() {
		$.shelljs.exec('open http://localhost:9000');
	});
	gulp.task('prod', function() {
		$.shelljs.exec('open https://www.npmjs.org/package/generator-gulp-requirejs');
	});
	gulp.task('dev', function() {
		$.shelljs.exec('open http://www.npmjs.org/package/generator-gulp-requirejs');
	});
	gulp.task('hml', function() {
		$.shelljs.exec('open https://www.npmjs.org/package/generator-gulp-requirejs');
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ alias
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('test', ['jsonlint', 'coffeelint', 'jshint', 'mocha']);
	gulp.task('build', ['test', 'html', 'images', 'svg']);

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ default
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('default', ['clean'], function() {
		gulp.start('build');
	});

}(require('gulp'), require('gulp-load-plugins')));
