'use strict';

var config = require('load-gulp-config');

config(require('gulp'), {
  configPath:config.util.path.join('tasks', '*.{js,yml}'),
  data:config.util.readJSON('package.json')
});
