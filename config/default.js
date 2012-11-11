// 重写所有请求
exports.globalRewriteMap = [/[^?]+\.(js|css)$/, '$0?t=20121111.$1'];

// 重写指定请求
exports.rewriteMap = [
	['http://www.kindsoft.net/ke4/kindeditor-all-min.js', 'http://www.kindsoft.net/ke4/kindeditor-all.js']
];
