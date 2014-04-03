'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var GulpRequirejsGenerator = yeoman.generators.Base.extend({
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
    this.log(chalk.magenta('You\'re using the fantastic GulpRequirejs generator.'));

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      default: true,
      choices: [{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;
      this.includeModernizr = features;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/fonts');
    this.mkdir('app/scripts');
    this.mkdir('app/images');
    this.mkdir('app/theme');
    this.mkdir('app/theme/base');
    this.mkdir('app/theme/layout');
    this.mkdir('app/theme/modules');
    this.mkdir('app/theme/states');

    this.copy('_gulpfile.js', 'gulpfile.js');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('gitattributes', '.gitattributes');
    this.copy('gitignore', '.gitignore');
    this.copy('jshintrc', '.jshintrc');
    this.copy('jscs.json', '.jscs.json');
    this.copy('bowerrc', '.bowerrc');
    this.copy('config.js', 'app/scripts/config.js');
    this.copy('scope.js', 'app/scripts/scope.js');
    this.copy('app.js', 'app/scripts/app.js');
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('_reset.scss', 'app/theme/base/_reset.scss');
    this.copy('_mixins.scss', 'app/theme/base/_mixins.scss');
    this.copy('_variables.scss', 'app/theme/base/_variables.scss');
    this.copy('_main.scss', 'app/theme/layout/_main.scss');
    this.copy('_menu.scss', 'app/theme/modules/_menu.scss');
    this.copy('_mediaqueries.scss', 'app/theme/states/_mediaqueries.scss');
    this.copy('_base.scss', 'app/theme/_base.scss');
    this.copy('_layout.scss', 'app/theme/_layout.scss');
    this.copy('_modules.scss', 'app/theme/_modules.scss');
    this.copy('_states.scss', 'app/theme/_states.scss');
    this.copy('theme.scss', 'app/theme.scss');
    this.copy('index.html', 'app/index.html');
    this.copy('htaccess', 'app/.htaccess');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('humans.txt', 'app/humans.txt');
  }
});

module.exports = GulpRequirejsGenerator;
