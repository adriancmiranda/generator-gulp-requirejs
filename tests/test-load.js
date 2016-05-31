/* global describe, beforeEach, it*/
'use strict';

var assert = require('assert');

describe('gulp-requirejs generator', function(){
  it('can be imported without blowing up', function(){
    var app = require('../generators/app');
    var front = require('../generators/front');
    var back = require('../generators/back');
    assert(app !== undefined);
    assert(front !== undefined);
    assert(back !== undefined);
  });
});
