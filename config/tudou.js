// 重写所有请求
exports.globalRewriteMap = [/([^?]+)_\d+(\.(?:js|css))/, '$1$2'];

// 重写指定请求
exports.rewriteMap = [
	['/js/lib/tuilib2.js', '/js/lib/tuilib2_src.js'],
	['/js/page/channels/v2/ch.js', '/js/page/channels/v2/ch_combo.js'],
	['http://www.kindsoft.net/ke4/kindeditor-all-min.js', 'http://www.kindsoft.net/ke4/kindeditor-all-min.js?t=20121111.js']
];
