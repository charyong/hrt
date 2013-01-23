
var Path = require('path');
var Fs = require('fs');
var Iconv = require('iconv-lite');

function each(obj, fn) {
	for (var key in obj) {

		if (obj.hasOwnProperty(key)) {
			if (fn.call(obj[key], key, obj[key]) === false) {
				break;
			}
		}

	}
}

function isRegExp(val) {
	return Object.prototype.toString.call(val) === '[object RegExp]';
}

function undef(val, defaultVal) {
	return typeof val === 'undefined' ? defaultVal : val;
}

function readFileSync(filePath, encoding) {
	var buffer = new Buffer('');

	try {
		buffer = Fs.readFileSync(filePath);
	} catch (e) {
		console.error(e.toString());
	}

	if (!encoding) {
		return buffer;
	}

	var fileStr = Iconv.fromEncoding(buffer, encoding);

	return fileStr;
}

function loadPlugin(name) {
	return require(__dirname + '/plugins/' + name + '.js');
}

// 0: no rewrite
// 1: remote rewrite
// 2: local rewrite
function rewrite(map, url) {
	for (var i = 0, len = map.length; i < len; i++) {
		var row = map[i];

		if (row.length != 2) {
			continue;
		}

		var from = row[0];
		var to = row[1];

		var index = url.indexOf(from);

		if (index >= 0) {
			var start = url.substr(0, index);
			var end = url.substr(index + from.length);

			if (Fs.existsSync(to)) {
				end = end.replace(/\?.*$/, '');
				to = Path.resolve(to + end);
				return [2, to];
			}

			to = start + to + end;
			return [1, to];
		}
	}

	return [0, url];
}

exports.each = each;
exports.isRegExp = isRegExp;
exports.undef = undef;
exports.loadPlugin = loadPlugin;
exports.readFileSync = readFileSync;
exports.rewrite = rewrite;
