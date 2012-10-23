var fs = require('fs');

var iconv = require('iconv-lite');

var toString = Object.prototype.toString;

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
	return toString.call(val) === '[object RegExp]';
}

function readFileSync(filePath, encoding) {
	var buffer = new Buffer('');

	try {
		buffer = fs.readFileSync(filePath);
	} catch (e) {
		console.log(e.toString());
	}

	if (!encoding) {
		return buffer;
	}

	var fileStr = iconv.fromEncoding(buffer, encoding);

	return fileStr;
}

exports.each = each;
exports.isRegExp = isRegExp;
exports.readFileSync = readFileSync;
