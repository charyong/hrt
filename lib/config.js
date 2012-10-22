// true时开启调试模式
exports.debug = false;

// 本地文件的根目录
exports.root = 'D:\\Projects\\static-trunk';

// 端口
exports.port = 80;

// 备用域名或代理，通过此域名下载远程文件
exports.proxyHost = 'http://10.5.111.2:8085';

// 重写所有请求
exports.globalRewriteMap = [/([^?]+)_\d+(\.(?:js|css))/, '$1$2'];

// 重写指定请求
exports.rewriteMap = [
	['/js/lib/tuilib2.js', '/js/lib/tuilib2_combo.js'],
	['/js/page/channels/v2/ch.js', '/js/page/channels/v2/ch_combo.js'],
	['/skin/__g/img/ui/nav/nav.png']
];
