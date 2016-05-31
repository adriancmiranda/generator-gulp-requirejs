'use strict';

var FrontEndGenerator = require('../front/index');
var BackEndGenerator = require('../back/index');
var Utils = require('../utils');
var lodash = require('lodash');
var yogen = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var Proto = require('Proto');
var path = require('path');

var FullStackGenerator = new Proto(yogen.Base, {
	constructor:function(args, options){
		this.super(args, options);
		this.option('debug', { type:Boolean, desc:'debug', defaults:false });
		this.argument('appname', { type:String, required:false, defaults:Utils.appname() });
		this.appname = lodash.camelCase(this.appname);
    this.pack = Utils.readJsonSync(path.join(__dirname, '../../package.json'));
    this.name = this.pack.name.replace(/^generator\-/, '');
    this.log(yosay(chalk.magenta('You\'re using the fantastic', chalk.yellow('Gulp\\RequireJS') + chalk.magenta(' fullstack generator.'))));
		this.composeWith(this.name +':front', { options:this.options, args:this.args });
    this.composeWith(this.name +':back', { options:this.options, args:this.args });
	}
});

module.exports = FullStackGenerator;
