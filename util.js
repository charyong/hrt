var FS = require('fs');
var ICONV = require('iconv-lite');

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
		buffer = FS.readFileSync(filePath);
	} catch (e) {
		console.log(e.toString());
	}

	if (!encoding) {
		return buffer;
	}

	var fileStr = ICONV.fromEncoding(buffer, encoding);

	return fileStr;
}

exports.each = each;
exports.isRegExp = isRegExp;
exports.undef = undef;
exports.readFileSync = readFileSync;
