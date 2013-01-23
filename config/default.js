
var localRoot = 'D:\\Projects\\static-trunk';

exports.map = [
	['http://js.tudouui.com/js/lib/tuilib2.js', localRoot + '/js/lib/tuilib2_src.js'],
	['http://jstest.tudouui.com/js/lib/tuilib2.js', localRoot + '/js/lib/tuilib2_src.js'],
];

exports.before = function(url) {
	var Tudou = this.util.loadPlugin('tudou');

	url = Tudou.stripVersionInfo(url);
	return url;
};

exports.merge = function(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');

	Tudou.mergeTui2(localRoot, path, callback);
};
