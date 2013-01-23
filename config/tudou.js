
exports.serverRoot = 'D:\\Projects\\static-trunk';

exports.map = [
	['http://js.tudouui.com/v3/dist', exports.serverRoot + '/v3/src'],
	['http://css.tudouui.com/v3/dist', exports.serverRoot + '/v3/src'],
	['http://jstest.tudouui.com/v3/dist', exports.serverRoot + '/v3/src'],
	['http://csstest.tudouui.com/v3/dist', exports.serverRoot + '/v3/src'],
	['http://localhost:8888/static-trunk/v3/dist', exports.serverRoot + '/v3/src'],
];

exports.before = function(url) {
	var Tudou = this.util.loadPlugin('tudou');

	url = Tudou.stripVersionInfo(url);
	url = Tudou.cssToLess(url);
	return url;
};

exports.merge = function(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');

	Tudou.merge.call(this, path, callback);
};
