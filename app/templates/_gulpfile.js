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
	//| test - (mocha)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('mocha', function() {
		gulp.src('test/*.js').pipe($.mocha({ reporter: 'list' }));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| jsonlint - (plumber, jshint, jscs)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('jsonlint', function() {
		return gulp.src([
			'package.json',
			'bower.json',
			'.bowerrc',
			'.jshintrc',
			'.jscs.json'
		]).pipe($.jsonlint()).pipe($.jsonlint.reporter()).pipe($.notify({
			message: '<%= options.date %> ✓ json: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| lint - (plumber, jshint, jscs)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('lint', ['jsonlint'], function() {
		return gulp.src([
			'gulpfile.js',
			_.app + '/scripts/**/*.js',
			'!' + _.app + '/scripts/vendor/**/*.js'
		])
		.pipe($.plumber()).pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter('default'))
		.pipe($.jscs()).pipe($.notify({
			message: '<%= options.date %> ✓ script: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| require - (plumber, size, notify)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('require', ['lint'], function() {
		$.requirejs({
			baseUrl: _.app + '/scripts',
			optimize: 'none',
			include: ['requirejs', 'config'],
			mainConfigFile: _.app + '/scripts/config.js',
			out: 'body.min.js',
			preserveLicenseComments: false,
			generateSourceMaps: true,
			useStrict: true,
			wrap: true
		})
		.pipe($.plumber())
		.pipe(gulp.dest(_.dist + '/scripts'))
		.pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ script: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| scripts - (plumber, concat, uglify, size, notify)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('scripts', ['lint'], function() {
		return gulp.src([
			_.app + '/scripts/vendor/modernizr/modernizr.js'
		])
		.pipe($.plumber())
		.pipe($.concat('header.min.js')).pipe($.uglify())
		.pipe(gulp.dest(_.dist + '/scripts'))
		.pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ script: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| svg - (svgmin)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('svg', function() {
		return gulp.src(_.app + '/*.svg')
		.pipe($.svgmin([{ removeDoctype: false }, { removeComments: false }]))
		.pipe(gulp.dest(_.dist)).pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ svg: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| images - (cache, imagemin, size, notify)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('images', ['svg'], function() {
		return gulp.src([
			_.app + '/*.{png,jpg,jpeg,gif,ico}',
			_.app + '/images/**/*.{png,jpg,jpeg,gif,ico}'
		]).pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))).pipe(gulp.dest(_.dist)).pipe($.size()).pipe($.notify({
			message: '<%= options.date %> ✓ image: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| theme - (plumber, rubySass, util, autoprefixer, size, notify)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('theme', function() {
		return gulp.src(_.app + '/theme.scss')
		.pipe($.plumber()).pipe($.rubySass({
			loadPath: [_.app + '/scripts/vendor'],
			require: ['sass-css-importer'],
			style: 'expanded',
			lineNumbers: true,
			sourcemap: true,
			compass: false,
			trace: true
		}).on('error', $.util.log))
		.pipe($.autoprefixer('last 1 version', '> 1%', 'ie 8'))
		.pipe(gulp.dest(_.dist))
		.pipe($.size())
		.pipe($.notify({
			message: '<%= options.date %> ✓ style: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| Inject bower components - (useref)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('bower', ['scripts', 'theme'], function() {
		return gulp.src(_.app + '/*.html')
		.pipe($.useref())
		.pipe(gulp.dest(_.dist)).pipe($.notify({
			message: '<%= options.date %> ✓ html: <%= file.relative %>',
			templateOptions: {
				date: new Date()
			}
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| connect - (connect)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('connect', $.connect.server({
		root: [_.app],
		livereload: true,
		port: 9000
	}));

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| watch - (watch)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('watch', ['connect'], function() {
		// Watch for changes in `app` dir
		gulp.src([
			_.app + '/*.css',
			_.app + '/fonts/**/*',
			_.app + '/scripts/**/*.js',
			_.app + '/**/*.{png,jpg,jpeg,gif,ico}'
		], { read: false }).pipe($.watch({}, function(files) {
			return files;
		})).pipe($.plumber());

		// Watch .{scss,sass} files
		$.watch({ glob: [_.app + '/**/*.{sass,scss}'] }, function() {
			gulp.start('theme');
		});

		// Watch .js files
		$.watch({ glob: [_.app + '/scripts/**/*.js'] }, function() {
			gulp.start('require');
		});

		// Watch image files
		$.watch({ glob: [_.app + '/**/*.{png,jpg,jpeg,gif,ico}'] }, function() {
			gulp.start('images');
		});

		// Watch bower files
		$.watch({ glob: [_.app + '/scripts/vendor/*'] }, function() {
			gulp.start('bower');
		});

		// Launch localhost
		gulp.start('localhost');
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| build
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('build', ['lint', 'mocha', 'bower', 'require', 'images'], function() {
		// N/A yet.
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| clean - (clean)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('clean', [], function() {
		var stream = gulp.src([
			_.dist + '/scripts',
			_.dist + '/images',
			_.dist + '/theme',
			_.dist + '/fonts'
		], { read: false });
		return stream.pipe($.clean());
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| environ - (shelljs)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('localhost', [], function() {
		$.shelljs.exec('open http://localhost:9000');
	});
	gulp.task('development', function() {
		$.shelljs.exec('open http://amproject.herokuapp.com/');
	});
	gulp.task('staging', function() {
		$.shelljs.exec('open https://amproject.herokuapp.com/');
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| alias
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('default', ['clean'], function() {
		gulp.start('build');
	});

}(require('gulp'), require('gulp-load-plugins')));
