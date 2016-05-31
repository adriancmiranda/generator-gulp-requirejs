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
var fsx = require('fs-extra');

var BackEndGenerator = new Proto(yogen.Base, {
	constructor:function(args, options){
		this.super(args, options);
		this.on('end', this.onEnd);
		this.option('debug', { type:Boolean, desc:'debug', defaults:true });
		this.argument('appname', { type:String, required:false, defaults:Utils.appname() });
		this.appname = lodash.camelCase(this.appname);
		this.pack = Utils.readJsonSync(path.join(__dirname, '../../package.json'));
		if(this.options.debug){
			this.log(yosay(chalk.magenta('You\'re using the fantastic', chalk.yellow('Gulp\\RequireJS') + chalk.magenta(' back-end generator.'))));
		}
	},

	prompting:function(){
		var done = this.async();
		this.prompt([{
			type:'input',
			name:'expressjs',
			message:'Would you like to use '+ chalk.red('ExpressJS') +'?',
			default:'./'
		}], Proto.bind(function(answers){
			done();
		}, this));
	},

	onEnd:function(){
		if(!this.options['skip-install']){
			// N/A yet.
		}
	}
});

module.exports = BackEndGenerator;
