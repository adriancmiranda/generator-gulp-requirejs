'use strict';

var GulpRequirejsGenerator
,	yeoman = require('yeoman-generator')
,	chalk = require('chalk')
,	util = require('util')
,	path = require('path')
;

module.exports = GulpRequirejsGenerator = yeoman.generators.Base.extend({
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
			var features = props.features;
			this.includeModernizr = this.hasFeature(features, 'includeModernizr');
			done();
		}.bind(this));
	},

	app: function () {
		// images
		this.mkdir('app/images');

		// scripts
		this.mkdir('app/scripts/application/routers');
		this.mkdir('app/scripts/application/views');
		this.mkdir('app/scripts/helpers');

		// styles
		this.mkdir('app/styles/theme/base');
		this.mkdir('app/styles/theme/images');
		this.mkdir('app/styles/theme/layout');
		this.mkdir('app/styles/theme/modules');
		this.mkdir('app/styles/theme/states');
		this.mkdir('app/styles/theme/typography');

		// test
		this.mkdir('test/lib/mocha');
		this.mkdir('test/spec');

		// essentials
		this.copy('_gulpfile.js', 'gulpfile.js');
		this.copy('_package.json', 'package.json');
		this.copy('_bower.json', 'bower.json');
		this.copy('_config.rb', 'config.rb');

		// hidden files
		this.copy('bower.rc', '.bowerrc');
		this.copy('git.ignore', '.gitignore');
		this.copy('git.attributes', '.gitattributes');
		this.copy('editor.config', '.editorconfig');
		this.copy('jshint.rc', '.jshintrc');
		this.copy('jscs.json', '.jscs.json');
	},

	projectfiles: function () {
		// app/scripts/helpers/
		this.copy('app/scripts/helpers/polyfills.js', 'app/scripts/helpers/polyfills.js');
		this.copy('app/scripts/helpers/utils.js', 'app/scripts/helpers/utils.js');

		// app/scripts/
		this.copy('app/scripts/application/routers.js', 'app/scripts/application/routers.js');
		this.copy('app/scripts/application/scope.js', 'app/scripts/application/scope.js');
		this.copy('app/scripts/application/views.js', 'app/scripts/application/views.js');
		this.copy('app/scripts/application.js', 'app/scripts/application.js');
		this.copy('app/scripts/config.js', 'app/scripts/config.js');

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

		// app/
		this.copy('app/404.html', 'app/404.html');
		this.copy('app/favicon.ico', 'app/favicon.ico');
		this.copy('app/ht.access', 'app/.htaccess');
		this.copy('app/humans.txt', 'app/humans.txt');
		this.copy('app/index.html', 'app/index.html');
		this.copy('app/robots.txt', 'app/robots.txt');

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
