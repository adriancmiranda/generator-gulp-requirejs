'use strict';

var child_process = require('child_process');
var Promise = require('bluebird');
var Proto = require('Proto');

var Shell = new Proto({}, {
	$:function(cmd){
		cmd = Array.isArray(cmd)? cmd : Array.prototype.slice.call(arguments);
		cmd = cmd.join(cmd.length > 1? ' && ' : '');
		return new Promise(function(resolve, reject){
			child_process.exec(cmd, function(fault, response){
				fault? reject(fault) : resolve(response);
			});
		});
	}
});

module.exports = Shell;
