
var root = 'D:\\Projects\\static-trunk';

exports.map = [
	['http://js.tudouui.com/js/lib/tuilib2.js', root + '/js/lib/tuilib2_src.js'],
	['http://js.tudouui.com/js/page/channels/v2/ch.js', root + '/js/page/channels/v2/ch_combo.js'],
];

exports.before = function(url) {
	return url.replace(/([^?]+)_\d+(\.(?:js|css))/, '$1$2');
};
