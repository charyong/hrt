
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

function printLocalFile(response, absoluteUrl, newPathname) {
	var absolutePath = config.root + newPathname;
	var contentType = mime.lookup(absolutePath);

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

function printRemoteFile(response, absoluteUrl, requestUrl) {
	var contentType = mime.lookup(requestUrl);

	var fileUrl = config.otherHost ? config.otherHost + requestUrl : config.proxyUrl + '?url=' + encodeURIComponent(absoluteUrl);

	if (config.debug) {
		console.log('[get] ' + absoluteUrl + ', real URL:' + fileUrl);
	}

	request(fileUrl, function (error, res, body) {
		if (error) {
			console.log('[error] file "' + fileUrl + '" was not found.');
			return;
		}

		if (res.statusCode == 200) {
			response.writeHead(200, {'Content-Type': contentType});
			response.write(body, 'binary');
			response.end();
		}
	});
}

function rewriteUrl(response, host, requestUrl) {
	var globalMap = config.globalRewriteMap;
	var rewriteMap = config.rewriteMap;
	var pathname = url.parse(requestUrl).pathname;
	var absoluteUrl = 'http://' + host + pathname;

	if (globalMap && globalMap.length == 2) {
		pathname = pathname.replace(globalMap[0], globalMap[1]);
	}

	for (var i = 0, len = rewriteMap.length; i < len; i++) {
		var rule = rewriteMap[i][0];
		var replaceText = rewriteMap[i][1];

		// return local file
		if (isRegExp(rule) && rule.test(pathname) || typeof rule == 'string' && pathname.indexOf(rule) >= 0) {
			var newPathname = pathname.replace(rule, replaceText);
			printLocalFile(response, absoluteUrl, newPathname);
			return;
		}
	}

	// return remote file
	printRemoteFile(response, absoluteUrl, requestUrl);
}

function main() {
	http.createServer(function(request, response) {
		var headers = request.headers;
		var host = headers.host;
		var requestUrl = request.url;
		var pathname = url.parse(requestUrl).pathname;

		// skip favicon
		if (pathname.indexOf('favicon.ico') > -1) {
			return;
		}

		rewriteUrl(response, host, requestUrl);
	}).listen(config.port);

	console.log('TPM Server runing at port: ' + config.port);
}

main();
