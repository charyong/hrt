
var localRoot = 'D:\\Projects\\static-trunk\\v3';

exports.map = [
	['http://js.tudouui.com/v3/dist', localRoot + '/src'],
	['http://css.tudouui.com/v3/dist', localRoot + '/src'],
	['http://jstest.tudouui.com/v3/dist', localRoot + '/src'],
	['http://csstest.tudouui.com/v3/dist', localRoot + '/src'],
	['http://localhost:8888/static-trunk/v3/dist', localRoot + '/src'],
];

var Tudou = require('../plugins/tudou');

exports.before = function(url) {
	var Tudou = this.util.loadPlugin('tudou');

	url = Tudou.stripVersionInfo(url);
	url = Tudou.cssToLess(url);
	return url;
};

exports.merge = function(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');

	Tudou.merge(localRoot, path, callback);
};
