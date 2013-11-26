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

// 将JS代码改成AMD模块，包含路径转换，补充模块ID，模板转换等
function fixModule(path, str) {
	var root = path.replace(/^(.*?)[\\\/](src|build|dist)[\\\/].*$/, '$1');
	var relativePath = path.split(Path.sep).join('/').replace(/^.+\/src\/js\//, '');
	var mid = relativePath.replace(/\.js$/, '');

	function resolveUrl(url) {
		while(true) {
			url = url.replace(/\w+\/\.\.\//g, '');
			if (!/\.\.\//.test(url)) {
				break;
			}
		}
		url = url.replace(/\.\//g, '');
		return url;
	}

	function fixDep(s, format) {
		if (format) {
			s = s.replace(/\s/g, '');
		}
		return s.replace(/(['"])(.+?)\1(,?)/g, function($0, $1, $2, $3) {
			var f = $2;
			if(f.charAt(0) == '.') {
				f = relativePath.replace(/[\w-]+\.js$/, '') + f;
				f = resolveUrl(f);
			}
			else if(f.charAt(0) == '/') {
				f = f.slice(1);
			}
			if (format) {
				return '\n  "' + f + '"' + $3 + '\n';
			} else {
				return $1 + f + $1 + $3;
			}
		}).replace(/,\n\n/g, ',\n');
	}

	// 补充模块ID
	if(/(?:^|[^\w\.])define\s*\(/.test(str) && !/(?:^|[^\w\.])define\s*\(\s*['"]/.test(str)) {
		str = str.replace(/\b(define\s*\(\s*)/, '$1"' + mid + '", ');
	}

	// 补齐依赖
	str = str.replace(/((?:^|[^\w\.])define\s*\(\s*['"].*?['"]\s*,\s*)([['"][\s\S]+?)(,\s*function\s*\()/g, function($0, $1, $2, $3) {
		return $1 + fixDep($2, true) + $3;
	});
	str = str.replace(/((?:^|[^\w\.])require\s*\(\s*)([\['"][\s\S]+?)(,\s*function\s*\()/g, function($0, $1, $2, $3) {
		return $1 + fixDep($2, false) + $3;
	});
	str = str.replace(/((?:^|[^\w\.])define\s*\(\s*['"].*?['"]\s*)(,\s*function\s*\()/g, '$1,[]$2');

	// 非AMD模块
	if(!/(?:^|[^\w\.])(define|require)\s*\(/.test(str)) {
		return str += '\n/* autogeneration */\n"define" in this && define("' + mid + '", [], function(){});\n';
	}

	// JS模板转换
	str = str.replace(/(\b)require\.text\(\s*(['"])(.+?)\2\s*\)/g, function($0, $1, $2, $3) {
		var f = $3;
		if(/^[a-z_/]/i.test(f)) {
			f = root + '/src/js/' + f;
		}
		else {
			f = path.replace(/[\w-]+\.js$/, '') + f;
			f = resolveUrl(f);
		}
		var s = Util.readFileSync(f, 'utf-8');
		s = s.replace(/^\uFEFF/, '');
		s = s.replace(/(\r\n|\r|\n)\s*/g, ' ');
		s = s.replace(/\\/g, '\\\\');
		s = s.replace(/'/g, "\\'");
		return $1 + "'" + s + "'";
	});

	return str;
}

// 合并本地文件
function merge(path, callback) {
	var root = path.replace(/^(.*?)[\\\/](src|build|dist)[\\\/].*$/, '$1');

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

	if (/src\/js\/(lib|lite|loader)\.js$/.test(newPath)) {

		// var str = Util.readFileSync(path, 'utf-8');
		// var debugStr = Util.readFileSync(root + '/src/js/lib/debug.js', 'utf-8');
		// return callback('application/javascript', str + debugStr);

	} else if (/src\/js\/.+\.js$/.test(newPath)) {

		var str = Util.readFileSync(path, 'utf-8');
		str = fixModule(path, str);
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
