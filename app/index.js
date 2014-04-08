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

		hasFeature: function (list, feat) {
			return (list || []).indexOf(feat) !== -1;
		},

		askFor: function () {
			var scope = this;
			var done = this.async();

			// have Yeoman greet the user
			this.log(this.yeoman);

			// replace it with a short and sweet description of your generator
			this.log(chalk.magenta('You\'re using the fantastic', chalk.yellow('Gulp\\RequireJS generator') + chalk.magenta('.')));

			var prompts = [
				{
					type: 'checkbox',
					name: 'Features',
					message: 'What more would you like?',
					default: true,
					choices: [
						{
							name: 'Modernizr',
							value: 'includeModernizr',
							checked: true
						},
						{
							name: 'jQuery',
							value: 'includejQuery',
							checked: true
						}
					]
				},
				{
					type: 'confirm',
					name: 'HTML5Shiv',
					value: 'includeHTML5Shiv',
					message: 'Would you like to use a crossbrowser workaround to ' + chalk.red('HTML5') + '?',
					when: function (answers) {
						return !scope.hasFeature(answers.Features, 'includeModernizr');
					}
				}
			];

			this.prompt(prompts, function (props) {
				// HTML features
				this.includeModernizr = this.hasFeature(props.Features, 'includeModernizr');
				this.includeHTML5Shiv = props.HTML5Shiv;
				this.hasHTML5Feat = this.includeModernizr || this.includeHTML5Shiv;

				// JS features
				this.includejQuery = this.hasFeature(props.Features, 'includejQuery');
				this.hasJSFeat = this.includejQuery;

				// Features
				this.hasFeat = this.hasHTML5Feat || this.hasJSFeat;
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
			this.mkdir('app/styles/base');
			this.mkdir('app/styles/layout');
			this.mkdir('app/styles/modules');
			this.mkdir('app/styles/states');
			this.mkdir('app/styles/typography');

			// test
			this.mkdir('test/lib/mocha');
			this.mkdir('test/spec');
		},

		bower: function () {
			this.log(chalk.green(' ✓', chalk.white('Bower')));
			this.copy('_bower.json', 'bower.json');
			this.copy('bower.rc', '.bowerrc');
		},

		ruby: function () {
			this.log(chalk.green('\n ✓', chalk.white('Ruby')));
			this.copy('_config.rb', 'config.rb');
		},

		gulp: function () {
			this.log(chalk.green('\n ✓', chalk.white('Gulp')));
			this.copy('_gulpfile.js', 'gulpfile.js');
		},

		npm: function () {
			this.log(chalk.green('\n ✓', chalk.white('NPM')));
			this.copy('_package.json', 'package.json');
		},

		editor: function () {
			this.log(chalk.green('\n ✓', chalk.white('Editor')));
			this.copy('editor.config', '.editorconfig');
		},

		git: function () {
			this.log(chalk.green('\n ✓', chalk.white('GIT')));
			this.copy('git.attributes', '.gitattributes');
			this.copy('git.ignore', '.gitignore');
		},

		jshint: function () {
			this.log(chalk.green('\n ✓', chalk.white('JSHint')));
			this.copy('jshint.rc', '.jshintrc');
		},

		jscs: function () {
			this.log(chalk.green('\n ✓', chalk.white('JSCS')));
			this.copy('jscs.json', '.jscs.json');
		},

		requirejs: function () {
			this.log(chalk.green('\n ✓', chalk.white('RequireJS')));
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
			this.log(chalk.green('\n ✓', chalk.white('BEM')));
			// app/styles/base
			this.copy('app/styles/base/_mixins.scss', 'app/styles/base/_mixins.scss');
			this.copy('app/styles/base/_params.scss', 'app/styles/base/_params.scss');
			this.copy('app/styles/base/_reset.scss', 'app/styles/base/_reset.scss');

			// app/styles/layout
			this.copy('app/styles/layout/_core.scss', 'app/styles/layout/_core.scss');
			this.copy('app/styles/layout/_footer.scss', 'app/styles/layout/_footer.scss');
			this.copy('app/styles/layout/_header.scss', 'app/styles/layout/_header.scss');

			// app/styles/modules
			this.copy('app/styles/modules/_menu.scss', 'app/styles/modules/_menu.scss');

			// app/styles/states
			this.copy('app/styles/states/_breakpoints.scss', 'app/styles/states/_breakpoints.scss');

			// app/styles/
			this.copy('app/styles/base.scss', 'app/styles/base.scss');
			this.copy('app/styles/layout.scss', 'app/styles/layout.scss');
			this.copy('app/styles/modules.scss', 'app/styles/modules.scss');
			this.copy('app/styles/states.scss', 'app/styles/states.scss');

			// app/styles/
			this.copy('app/styles/theme.scss', 'app/styles/theme.scss');
		},

		h5bp: function () {
			this.log(chalk.green('\n ✓', chalk.white('H5BP')));
			// app/
			this.copy('app/404.html', 'app/404.html');
			this.copy('app/images/cover.png', 'app/images/cover.png');
			this.copy('app/favicon.ico', 'app/favicon.ico');
			this.copy('app/ht.access', 'app/.htaccess');
			this.copy('app/humans.txt', 'app/humans.txt');
			this.copy('app/robots.txt', 'app/robots.txt');
		},

		writeIndex: function () {
			this.copy('app/index.html', 'app/index.html');
		},

		mocha: function () {
			this.log(chalk.green('\n ✓', chalk.white('Mocha')));
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
