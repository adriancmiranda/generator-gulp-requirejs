'use strict';

var path = require('path');
var fsx = require('fs-extra');

exports.readJsonSync = function(filepath, opts){
	if(typeof filepath === 'string')
		return fsx.readJsonSync(filepath, Object.assign({ throws:false }, opts));
	return {};
};

exports.hasFeature = function(list, feature){
	return !!~(Array.isArray(list)? list : []).indexOf(feature);
};
