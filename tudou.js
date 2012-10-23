
var iconv = require('iconv-lite');

var config = require('./config');
var util = require('./util');

var pathMap = {};

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
			var fileStr;

			if (/\.tpl$/.test(filePath)) {
				fileStr = util.readFileSync(absolutePath, 'utf8');
			} else {
				fileStr = util.readFileSync(absolutePath, 'gbk');
			}

			if (/\.js$/.test(filePath)) {
				grepPath(fileStr);
			}

			pathMap[filePath] = fileStr;
		}
	}

}

function merge(absolutePath) {
	// 二进制文件
	if (!/(\.js|\.css|\.tpl)$/.test(absolutePath)) {
		return util.readFileSync(absolutePath);
	}

	// 文本文件
	var src = util.readFileSync(absolutePath, 'gbk');

	grepPath(src);

	var dist = '';

	util.each(pathMap, function(filePath, fileStr) {

		if (/\.tpl$/.test(filePath)) {
			var varName = filePath.replace(/^js\/|\.tpl$/g, '');
			varName = 'tpl_' + varName.replace(/\//g, '_');

			fileStr = fileStr.replace(/(\r\n|\r|\n)/g, '');

			dist += varName + " = '" + fileStr + "'\n";
		} else {
			dist += fileStr + '\n';
		}

	});

	dist += '\n' + src;

	return iconv.toEncoding(dist, 'gbk');
}

exports.merge = merge;
