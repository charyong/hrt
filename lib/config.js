
exports.debug = false;

exports.root = 'D:\\Projects\\static-trunk';

exports.port = 80;

//exports.otherHost = 'http://css.tudouui.com';

exports.proxyUrl = 'http://10.5.111.2/wget.php';

exports.globalRewriteMap = [/([^?]+)_\d+(\.(?:js|css))/, '$1$2'];

exports.rewriteMap = [
	['/js/lib/tuilib2', '/js/lib/tuilib2'],
	['/js/page/channels/v2/ch.js', '/js/page/channels/v2/ch.js']
];
