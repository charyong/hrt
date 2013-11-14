var Fs = require('fs');
var Path = require('path');
var Util = require('../util');
var Less = require('less');
var Mime = require('mime');
var Iconv = require('iconv-lite');

var RE_AUTOFIXNAME = /define\((?=[^'"])/;

// URL移除版本号
function stripVersionInfo(url) {
	return url.replace(/([^?]+)_\d+(\.(?:js|css|swf|png|jpg|gif))/i, '$1$2');
}

// CSS扩展名改成LESS
function cssToLess(url) {
	return url.replace(/\.css$/, '.less');
}

// 支持相对路径，补充模块ID，模板转换等
function fixModule(root, path, pathname, data) {
	if(/\bdefine\s*\(/.test(data) && !/\bdefine\s*\(\s*['"]/.test(data)) {
		data = data.replace(/\b(define\s*\(\s*)/, '$1\'' + pathname.slice(11).replace(/\.js$/, '') + '\', ').replace(/^\//, '');
	}
	data = data.replace(/\brequire\s*\(\s*[['"].+,\s*function\s*\(/g, function() {
		var s = arguments[0];
		s = s.replace(/(['"])(.+?)\1/g, function() {
			var f = arguments[2];
			if(f.charAt(0) == '.') {
				f = pathname.slice(11).replace(/[\w-]+\.js$/, '').replace(/^\//, '') + f;
				f = f.replace(/\w+\/\.\.\//g, '').replace(/\.\//g, '');
			}
			else if(f.charAt(0) == '/') {
				f = f.slice(1);
			}
			return arguments[1] + f + arguments[1];
		});
		return s;
	});

	data = data.replace(/\brequire\s*\.\s*text\s*\(\s*(['"])([\w-./]+)\1\s*\)/g, function() {
		var f = arguments[2];
		if(/^[a-z_/]/i.test(f)) {
			f = root + '/src/js/' + f;
		}
		else {
			f = path.replace(/[\w-]+\.js$/, '') + f;
			f = f.replace(/\w+\/\.\.\//g, '').replace(/\.\//g, '');
		}
		var s = '';
		try {
			s = Fs.readFileSync(f, {
				encoding: 'utf-8'
			});

		} catch(e) {
			console.error(e);
			s = e.toString();
		}
		s = s.replace(/^\uFEFF/, '');
		s = s.replace(/(\r\n|\r|\n)\s*/g, ' ');
		s = s.replace(/\\/g, '\\\\');
		s = s.replace(/'/g, "\\'");
		return "'" + s + "'";
	});

	return data;
}

// 合并本地文件
function merge(path, callback) {
	var root = path.replace(/^(.*?)[\\\/](src|build|dist)[\\\/].*$/, '$1');
	var pathname = this.req.url.replace(/^https?:\/\/[^\/]+/, '');

	var newPath = path.split(Path.sep).join('/');

	// CSS
	if (/\.less$/.test(newPath)) {
		var str = Util.readFileSync(path, 'utf-8');

		var parser = new(Less.Parser)({
			env : 'development',
			dumpLineNumbers : 'all',
			paths : ['.', root + '/src/css'],
			filename : path,
		});

		parser.parse(str, function(error, tree) {
			if (error) {
				return console.error(error);
			}
			callback('text/css', tree.toCSS());
		});
		return;
	}

	// if (/src\/js\/(lib|lite|loader)\.js$/.test(newPath)) {

	// 	var str = Util.readFileSync(path, 'utf-8');

	// 	var debugStr = Util.readFileSync(root + '/src/js/lib/debug.js', 'utf-8');

	// 	return callback('application/javascript', str + debugStr);

	// }

	if (/src\/js\/.+\.js$/.test(newPath)) {

		var str = Util.readFileSync(path, 'utf-8');

		str = fixModule(root, path, pathname, str);

		return callback('application/javascript', str);
	}

	var contentType = Mime.lookup(path);
	var buffer = Util.readFileSync(path);

	return callback(contentType, buffer);
}

// 合并TUI2文件
function mergeTui2(path, callback) {
	var root = this.config.serverRoot;
	var subDir = /\.css$/.test(path) ? 'skin' : 'js';

	var pathMap = {};

	function grepPath(src) {
		var regExp = /(?:\*|\\\\) +@import +([\/\w\-\.]+)/ig;
		var match;

		while((match = regExp.exec(src))) {
			var filePath = match[1];

			if (!/^(js|skin)\//.test(filePath)) {
				filePath = subDir + '/' + filePath;
			}

			var path = root + '/' + filePath;

			if (typeof pathMap[filePath] == 'undefined') {
				var encoding = /\.tpl$/.test(filePath) ? 'utf8' : 'gbk';

				var fileStr = Util.readFileSync(path, encoding);

				if (/\.(js|css)$/.test(filePath)) {
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

			fileStr = fileStr.replace(/(\r\n|\r|\n)\s*/g, ' ').replace(/'/g, "\\'");

			dist += 'var ' + varName + " = '" + fileStr + "';\n";
		} else {
			dist += fileStr + '\n';
		}

	});

	dist += '\n' + src;

	dist = Iconv.toEncoding(dist, 'gbk');

	callback(/\.css$/.test(path) ? 'text/css' : 'application/javascript', dist);
}

exports.stripVersionInfo = stripVersionInfo;
exports.cssToLess = cssToLess;
exports.merge = merge;
exports.mergeTui2 = mergeTui2;
