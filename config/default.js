
exports.serverRoot = 'D:\\Projects\\static-trunk';

exports.map = [
	['http://js.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_src.js'],
	['http://jstest.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_src.js'],
	['http://css.tudouui.com/skin/__g/__g.css', exports.serverRoot + '/skin/__g/__g_src.css'],
	['http://csstest.tudouui.com/skin/__g/__g.css', exports.serverRoot + '/skin/__g/__g_src.css'],
];

exports.before = function(url) {
	var Tudou = this.util.loadPlugin('tudou');

	url = Tudou.stripVersionInfo(url);
	return url;
};

exports.merge = function(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');

	Tudou.mergeTui2.call(this, path, callback);
};
