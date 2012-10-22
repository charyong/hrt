
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');

var mime = require('mime');
var request = require('request');

var config = require('./config');

var toString = Object.prototype.toString;

function isRegExp(val) {
	return toString.call(val) === '[object RegExp]';
}

function getContentType(path) {
	return mime.lookup(path);
}

function printLocalFile(response, absoluteUrl, newPathname) {
	var absolutePath = config.root + newPathname;

	var contentType = getContentType(newPathname);

	console.log('[rewrite] ' + absoluteUrl + ' -> ' + absolutePath + newPathname);

	fs.exists(absolutePath, function (exists) {
		if (!exists) {
			console.log('[error] file "' + absolutePath + '" was not found.');
			return;
		}

		fs.readFile(absolutePath, 'binary', function(err, file) {
			if (err) {
				console.log('[error] cannot read file "' + absolutePath + '".');
				return;
			}

			response.writeHead(200, {'Content-Type': contentType});
			response.write(file, 'binary');
			response.end();
		});
	});
}

function main() {
	http.createServer(function(req, resp) {
		var headers = req.headers;
		var host = headers.host;
		var requestUrl = req.url;
		var pathname = url.parse(requestUrl).pathname;

		// skip favicon
		if (pathname.indexOf('favicon.ico') > -1) {
			return;
		}

		var globalMap = config.globalRewriteMap;
		var rewriteMap = config.rewriteMap;
		var absoluteUrl = 'http://' + host + pathname;
		var proxyUrl = config.proxyHost + requestUrl;

		// rewrite path by globalRewriteMap
		if (globalMap && globalMap.length == 2) {
			pathname = pathname.replace(globalMap[0], globalMap[1]);
		}

		// rewrite path by rewriteMap
		for (var i = 0, len = rewriteMap.length; i < len; i++) {
			var row = rewriteMap[i];
			var rule = row[0];
			var replaceText = row.length == 1 ? rule : row[1];

			// return local file
			if (isRegExp(rule) && rule.test(pathname) || typeof rule == 'string' && pathname.indexOf(rule) >= 0) {
				var newPathname = pathname.replace(rule, replaceText);
				printLocalFile(resp, absoluteUrl, newPathname);
				return;
			}
		}

		// return remote file
		if (config.debug) {
			console.log('[get] ' + absoluteUrl + ', real URL:' + proxyUrl);
		}
		req.pipe(request(proxyUrl)).pipe(resp);

	}).listen(config.port);

	console.log('Rewrite Server runing at port: ' + config.port);
}

main();
