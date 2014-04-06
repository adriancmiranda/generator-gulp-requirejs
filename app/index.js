(function (GulpRequirejsGenerator, yo, chalk, util, path) {
	'use strict';

	chalk = require('chalk'),
	util = require('util'),
	path = require('path');

	GulpRequirejsGenerator.exports = yo.generators.Base.extend({
		init: function () {
			this.pkg = require('../package.json');
			this.on('end', function () {
				if (!this.options['skip-install']) {
					this.installDependencies();
				}
			});
		},

		askFor: function () {
			var done = this.async();

			// have Yeoman greet the user
			this.log(this.yeoman);

			// replace it with a short and sweet description of your generator
			this.log(chalk.magenta('You\'re using the fantastic Gulp\\RequireJS generator.'));

			var prompts = [
				{
					type: 'checkbox',
					name: 'features',
					message: 'What more would you like?',
					default: true,
					choices: [
						{
							name: 'Modernizr',
							value: 'includeModernizr',
							checked: true
						}
					]
				}
			];

			this.hasFeature = function (list, feat) {
				return list.indexOf(feat) !== -1;
			};

			this.prompt(prompts, function (props) {
				var features = (props.features || []);
				this.includeModernizr = this.hasFeature(features, 'includeModernizr');
				done();
			}.bind(this));
		},

		tree: function () {
			this.log(chalk.magenta('Tree:'));

			// images
			this.mkdir('app/images');

			// scripts
			this.mkdir('app/scripts/application/routers');
			this.mkdir('app/scripts/application/views');
			this.mkdir('app/scripts/helpers');

			// styles
			this.mkdir('app/styles/theme/base');
			this.mkdir('app/styles/theme/layout');
			this.mkdir('app/styles/theme/modules');
			this.mkdir('app/styles/theme/states');
			this.mkdir('app/styles/theme/typography');

			// test
			this.mkdir('test/lib/mocha');
			this.mkdir('test/spec');
		},

		bower: function () {
			this.log(chalk.magenta(' ✓ Bower:'));
			this.copy('_bower.json', 'bower.json');
			this.copy('bower.rc', '.bowerrc');
		},

		ruby: function () {
			this.log(chalk.magenta(' ✓ Ruby:'));
			this.copy('_config.rb', 'config.rb');
		},

		gulp: function () {
			this.log(chalk.magenta(' ✓ Gulp:'));
			this.copy('_gulpfile.js', 'gulpfile.js');
		},

		npm: function () {
			this.log(chalk.magenta(' ✓ NPM:'));
			this.copy('_package.json', 'package.json');
		},

		editor: function () {
			this.log(chalk.magenta(' ✓ Editor:'));
			this.copy('editor.config', '.editorconfig');
		},

		git: function () {
			this.log(chalk.magenta(' ✓ GIT:'));
			this.copy('git.attributes', '.gitattributes');
			this.copy('git.ignore', '.gitignore');
		},

		jshint: function () {
			this.log(chalk.magenta(' ✓ JSHint:'));
			this.copy('jshint.rc', '.jshintrc');
		},

		jscs: function () {
			this.log(chalk.magenta(' ✓ JSCS:'));
			this.copy('jscs.json', '.jscs.json');
		},

		requirejs: function () {
			this.log(chalk.magenta(' ✓ RequireJS:'));
			// app/scripts/helpers/
			this.copy('app/scripts/helpers/polyfills.js', 'app/scripts/helpers/polyfills.js');
			this.copy('app/scripts/helpers/utils.js', 'app/scripts/helpers/utils.js');

			// app/scripts/
			this.copy('app/scripts/application/routers.js', 'app/scripts/application/routers.js');
			this.copy('app/scripts/application/scope.js', 'app/scripts/application/scope.js');
			this.copy('app/scripts/application/views.js', 'app/scripts/application/views.js');
			this.copy('app/scripts/application.js', 'app/scripts/application.js');
			this.copy('app/scripts/config.js', 'app/scripts/config.js');
		},

		bem: function () {
			this.log(chalk.magenta(' ✓ BEM:'));
			// app/styles/theme/base
			this.copy('app/styles/theme/base/_mixins.scss', 'app/styles/theme/base/_mixins.scss');
			this.copy('app/styles/theme/base/_params.scss', 'app/styles/theme/base/_params.scss');
			this.copy('app/styles/theme/base/_reset.scss', 'app/styles/theme/base/_reset.scss');

			// app/styles/theme/layout
			this.copy('app/styles/theme/layout/_core.scss', 'app/styles/theme/layout/_core.scss');
			this.copy('app/styles/theme/layout/_footer.scss', 'app/styles/theme/layout/_footer.scss');
			this.copy('app/styles/theme/layout/_header.scss', 'app/styles/theme/layout/_header.scss');

			// app/styles/theme/modules
			this.copy('app/styles/theme/modules/_menu.scss', 'app/styles/theme/modules/_menu.scss');

			// app/styles/theme/states
			this.copy('app/styles/theme/states/_breakpoints.scss', 'app/styles/theme/states/_breakpoints.scss');

			// app/styles/theme/
			this.copy('app/styles/theme/_base.scss', 'app/styles/theme/_base.scss');
			this.copy('app/styles/theme/_layout.scss', 'app/styles/theme/_layout.scss');
			this.copy('app/styles/theme/_modules.scss', 'app/styles/theme/_modules.scss');
			this.copy('app/styles/theme/_states.scss', 'app/styles/theme/_states.scss');

			// app/styles/
			this.copy('app/styles/theme.scss', 'app/styles/theme.scss');
		},

		h5bp: function () {
			this.log(chalk.magenta(' ✓ H5BP:'));
			// app/
			this.copy('app/404.html', 'app/404.html');
			this.copy('app/favicon.ico', 'app/favicon.ico');
			this.copy('app/ht.access', 'app/.htaccess');
			this.copy('app/humans.txt', 'app/humans.txt');
			this.copy('app/robots.txt', 'app/robots.txt');
		},

		writeIndex: function () {
			this.log(chalk.magenta(' ✓ Index:'));
			this.copy('app/index.html', 'app/index.html');
		},

		mocha: function () {
			this.log(chalk.magenta(' ✓ Mocha:'));
			// test/lib/mocha/
			this.copy('test/lib/mocha/mocha.css', 'test/lib/mocha/mocha.css');
			this.copy('test/lib/mocha/mocha.js', 'test/lib/mocha/mocha.js');

			// test/lib/
			this.copy('test/lib/chai.js', 'test/lib/chai.js');
			this.copy('test/lib/expect.js', 'test/lib/expect.js');

			// test/spec/
			this.copy('test/spec/test.js', 'test/spec/test.js');

			// test/
			this.copy('test/index.html', 'test/index.html');
		}
	});

}(module, require('yeoman-generator')));
