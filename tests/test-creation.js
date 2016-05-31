/* global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('gulp-requirejs generator', function(){
  beforeEach(function(done){
    helpers.testDirectory(path.join(__dirname, 'temp'), function(err){
      if(err) return done(err);
      var generator = ['../../generators/app'];
      this.app = helpers.createGenerator('gulp-requirejs:app', generator);
      done();
    }.bind(this));
  });

  it('creates expected files', function(done){
    var expected = ['.editorconfig'];
    helpers.mockPrompt(this.app, { someOption:true });
    this.app.options['skip-install'] = true;
    this.app.run({}, function(){
      helpers.assertFile(expected);
      done();
    });
  });
});
