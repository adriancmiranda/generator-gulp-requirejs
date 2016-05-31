'use strict';

var Shell = require('../shell');
var Utils = require('../utils');
var lodash = require('lodash');
var Proto = require('Proto');
var yogen = require('yeoman-generator');
var mkdirp = require('mkdirp');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');

var FrontEndGenerator = new Proto(yogen.Base, {
	constructor:function(args, options){
		this.super(args, options);
		this.on('end', this.onEnd);
		this.option('debug', { type:Boolean, desc:'debug', defaults:true });
		this.argument('appname', { type:String, required:false, defaults:Utils.appname() });
		this.appname = lodash.camelCase(this.appname);
		this.pack = Utils.readJsonSync(path.join(__dirname, '../../package.json'));
		if(this.options.debug){
			this.log(yosay(chalk.magenta('You\'re using the fantastic', chalk.yellow('Gulp\\RequireJS') + chalk.magenta(' front-end generator.'))));
		}
	},

	prompting:function(){
		var done = this.async();
		this.prompt([{
			type:'checkbox',
			name:'Features',
			message:'What more would you like?',
			default:true,
			choices:[
				{
					name:'Modernizr',
					value:'includeModernizr',
					checked:true
				},
				{
					name:'jQuery',
					value:'includejQuery',
					checked:true
				}
			]
		}, {
			type:'confirm',
			name:'HTML5Shiv',
			value:'includeHTML5Shiv',
			message:'Would you like to use a crossbrowser workaround to ' + chalk.red('HTML5') + '?',
			when:function(answers){
				return !Utils.hasFeature(answers.Features, 'includeModernizr');
			}
		}, {
			type:'confirm',
			name:'Sizzle',
			value:'includeSizzle',
			message:'Would you like to use a pure-JavaScript CSS selector engine?',
			when:function(answers){
				return !Utils.hasFeature(answers.Features, 'includejQuery');
			}
		}], Proto.bind(function(answers){
			// HTML features
			this.includeModernizr = Utils.hasFeature(answers.Features, 'includeModernizr');
			this.includeHTML5Shiv = answers.HTML5Shiv;
			this.hasHTML5Feat = this.includeModernizr || this.includeHTML5Shiv;

			// JS features
			this.includejQuery = Utils.hasFeature(answers.Features, 'includejQuery');
			this.includeSizzle = answers.Sizzle;
			this.hasJSFeat = this.includejQuery || this.includeSizzle;

			// Features
			this.hasFeat = this.hasHTML5Feat || this.hasJSFeat;

			done();
		}, this));
	},

	writing:{
		tree:function(){
			this.log(chalk.magenta('Tree:'));

			// images
			mkdirp('app/images');

			// scripts
			mkdirp('app/scripts/application/routers');
			mkdirp('app/scripts/application/views');
			mkdirp('app/scripts/helpers');

			// styles
			mkdirp('app/styles/base');
			mkdirp('app/styles/layout');
			mkdirp('app/styles/modules');
			mkdirp('app/styles/states');
			mkdirp('app/styles/typography');

			// test
			mkdirp('test/lib/mocha');
			mkdirp('test/spec');
		},

		work:function(){
			this.copy('README.md', 'README.md');
		},

		bower:function(){
			this.log(chalk.green(' ✓', chalk.white('Bower')));
			this.copy('_bower.json', 'bower.json');
			this.copy('bower.rc', '.bowerrc');
		},

		gulp:function(){
			this.log(chalk.green('\n ✓', chalk.white('Gulp')));
			this.copy('_gulpfile.js', 'gulpfile.js');
		},

		npm:function(){
			this.log(chalk.green('\n ✓', chalk.white('NPM')));
			this.copy('_package.json', 'package.json');
		},

		editor:function(){
			this.log(chalk.green('\n ✓', chalk.white('Editor')));
			this.copy('editor.config', '.editorconfig');
		},

		git:function(){
			this.log(chalk.green('\n ✓', chalk.white('GIT')));
			this.copy('git.attributes', '.gitattributes');
			this.copy('git.ignore', '.gitignore');
		},

		csslint:function(){
			this.log(chalk.green('\n ✓', chalk.white('CSSLint')));
			this.copy('csslint.rc', '.csslintrc');
		},

		jshint:function(){
			this.log(chalk.green('\n ✓', chalk.white('JSHint')));
			this.copy('jshint.rc', '.jshintrc');
		},

		jscs:function(){
			this.log(chalk.green('\n ✓', chalk.white('JSCS')));
			this.copy('jscs.json', '.jscs.json');
		},

		requirejs:function(){
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

		bem:function(){
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

		h5bp:function(){
			this.log(chalk.green('\n ✓', chalk.white('H5BP')));

			// app/
			this.copy('app/404.html', 'app/404.html');
			this.copy('app/images/cover.png', 'app/images/cover.png');
			this.copy('app/favicon.ico', 'app/favicon.ico');
			this.copy('app/ht.access', 'app/.htaccess');
			this.copy('app/humans.txt', 'app/humans.txt');
			this.copy('app/robots.txt', 'app/robots.txt');
		},

		writeIndex:function(){
			this.copy('app/index.html', 'app/index.html');
		},

		mocha:function(){
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
	},

	onEnd:function(){
		if(!this.options['skip-install']){
			this.installDependencies();
		}
	}
});

module.exports = FrontEndGenerator;
