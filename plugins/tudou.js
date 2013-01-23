
var Path = require('path');
var Util = require('../util');
var Less = require('less');
var Mime = require('mime');
var Iconv = require('iconv-lite');

// URL移除版本号
function stripVersionInfo(url) {
	return url.replace(/([^?]+)_\d+(\.(?:js|css))/, '$1$2');
}

// CSS扩展名改成LESS
function cssToLess(url) {
	return url.replace(/\.css$/, '.less');
}

// 合并本地文件
function merge(root, path, callback) {
	var dummyPath = path.split(Path.sep).join('/');

	// CSS
	if (/\.less$/.test(dummyPath)) {
		var content = Util.readFileSync(path, 'utf-8');

		var parser = new(Less.Parser)({
			paths: ['.', root + '/src/css']
		});

		parser.parse(content, function(error, tree) {
			if (error) {
				return console.error(error);
			}
			callback('text/css', tree.toCSS());
		});
		return;
	}

	// Global JS
	if (/src\/js\/g\.js$/.test(dummyPath)) {
		var content = Util.readFileSync(path, 'utf-8');

		var ozContent = Util.readFileSync(root + '/src/js/lib/oz.js', 'utf-8');

		callback('application/javascript', ozContent + content);
		return;
	}

	var contentType = Mime.lookup(path);
	var buffer = Util.readFileSync(path);

	return callback(contentType, buffer);
}

// 合并TUI2文件
function mergeTui2(root, path, callback) {

	var pathMap = {};

	function grepPath(src) {
		var regExp = /(?:\*|\\\\) +@import +([\/\w\-\.]+)/ig;
		var match;

		while((match = regExp.exec(src))) {
			var filePath = match[1];

			if (filePath.indexOf('js/') !== 0) {
				filePath = 'js/' + filePath;
			}

			var path = root + '/' + filePath;

			if (typeof pathMap[filePath] == 'undefined') {
				var fileStr;

				if (/\.tpl$/.test(filePath)) {
					fileStr = Util.readFileSync(path, 'utf8');
				} else {
					fileStr = Util.readFileSync(path, 'gbk');
				}

				if (/\.js$/.test(filePath)) {
					grepPath(fileStr);
				}

				pathMap[filePath] = fileStr;
			}
		}
	}

	// 二进制文件
	if (!/(\.js|\.css|\.tpl)$/.test(path)) {
		var contentType = Mime.lookup(path);
		var buffer = Util.readFileSync(path);

		return callback(contentType, buffer);
	}

	// 文本文件
	var src = Util.readFileSync(path, 'gbk');

	grepPath(src);

	var dist = '';

	Util.each(pathMap, function(filePath, fileStr) {

		if (/\.tpl$/.test(filePath)) {
			var varName = filePath.replace(/^js\/|\.tpl$/g, '');
			varName = 'tpl_' + varName.replace(/\//g, '_');

			fileStr = fileStr.replace(/(\r\n|\r|\n)/g, '').replace(/'/g, "\\'");

			dist += 'var ' + varName + " = '" + fileStr + "';\n";
		} else {
			dist += fileStr + '\n';
		}

	});

	dist += '\n' + src;

	dist = Iconv.toEncoding(dist, 'gbk');

	callback('application/javascript', dist);
}

exports.stripVersionInfo = stripVersionInfo;
exports.cssToLess = cssToLess;
exports.merge = merge;
exports.mergeTui2 = mergeTui2;
