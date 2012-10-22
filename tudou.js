
var fs = require('fs');

var iconv = require('iconv-lite');

var config = require('./config');

var pathMap = {};

function each(obj, fn) {
	for (var key in obj) {

		if (obj.hasOwnProperty(key)) {
			if (fn.call(obj[key], key, obj[key]) === false) {
				break;
			}
		}

	}
}

function readFileSync(filePath, encoding) {
	var fileStr = '';

	try {
		fileStr = fs.readFileSync(filePath, encoding);
	} catch (e) {
		console.log('[error] cannot read file "' + filePath + '".');
	}

	return fileStr;
}

function grepPath(src) {
	var regExp = /(?:\*|\\\\) +@import +([\/\w\-\.]+)/ig;
	var match;

	while((match = regExp.exec(src))) {
		var filePath = match[1];

		if (filePath.indexOf('js/') !== 0) {
			filePath = 'js/' + filePath;
		}

		var absolutePath = config.root + '/' + filePath;

		if (typeof pathMap[filePath] == 'undefined') {

			var fileStr = readFileSync(absolutePath, 'binary');

			if (/\.tpl$/.test(filePath)) {
				fileStr = iconv.decode(iconv.encode(fileStr, 'utf8'), 'binary');
			}

			if (/\.js$/.test(filePath)) {
				grepPath(fileStr);
			}

			pathMap[filePath] = fileStr;
		}
	}

}

function merge(src) {

	grepPath(src);

	var dist = '';

	each(pathMap, function(filePath, fileStr) {

		if (/\.tpl$/.test(filePath)) {
			var varName = filePath.replace(/^js\/|\.tpl$/g, '');
			varName = 'tpl_' + varName.replace(/\//g, '_');

			fileStr = fileStr.replace(/(\r\n|\r|\n)/g, '');

			dist += varName + " = '" + fileStr + "'\n";
		} else {
			dist += fileStr + '\n';
		}

	});

	return dist + '\n' + src;
}

exports.merge = merge;