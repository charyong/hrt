
var localRoot = 'D:\\Projects\\static-trunk';

exports.map = [
	['http://js.tudouui.com/js/lib/tuilib2.js', localRoot + '/js/lib/tuilib2_src.js'],
	['http://jstest.tudouui.com/js/lib/tuilib2.js', localRoot + '/js/lib/tuilib2_src.js'],
];

var Tudou = require('../plugins/tudou');

exports.before = function(url) {
	url = Tudou.stripVersionInfo(url);
	return url;
};

exports.merge = function(path, callback) {
	Tudou.mergeTui2(localRoot, path, callback);
};
