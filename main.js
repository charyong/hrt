
var HTTP = require('http');
var URL = require('url');
var FS = require('fs');

var MIME = require('mime');
var REQUEST = require('request');

var UTIL = require('./util');

var OPTIMIST = require('optimist');

OPTIMIST.usage([
	'Usage: rewrite --config=[/path/to/config.js] --port=[number] --debug=[true/false]\n\n',
	'Examples:\n',
	'rewrite --config=config/my.js\n',
	'rewrite --config=config/my.js --port=8080\n',
	'rewrite --config=config/my.js --debug=true'
].join(''));

var ARGV = OPTIMIST.argv;

if (ARGV.help) {
	OPTIMIST.showHelp();
	process.exit();
}

var PORT = UTIL.undef(ARGV.port, 2222);
var CONFIG_FILE = UTIL.undef(ARGV.config, __dirname + '/config/default.js');
var DEBUG = UTIL.undef(ARGV.debug, false);

var CONFIG = require(CONFIG_FILE);

function getContentType(path) {
	return MIME.lookup(path);
}

function printLocalFile(response, absoluteUrl, newPathname) {
	var absolutePath = config.root + newPathname;

	var contentType = getContentType(newPathname);

	console.log('[rewrite] ' + absoluteUrl + ' -> ' + absolutePath);

	var buffer = build.merge(absolutePath);

	response.writeHead(200, {'Content-Type': contentType});
	response.write(buffer);
	response.end();
}

function main() {
	// reload config
	FS.watch(CONFIG_FILE, function(event, filename) {
		if(event == 'change') {
			delete require.cache[CONFIG_FILE];
			CONFIG = require(CONFIG_FILE);
			console.log(CONFIG.rewriteMap);
		}
	});
	// start server
	HTTP.createServer(function(request, response) {
		config = require('./config');

		var headers = request.headers;
		var host = headers.host;
		var requestUrl = request.url;
		var pathname = URL.parse(requestUrl).pathname;

		var globalMap = config.globalRewriteMap;
		var rewriteMap = config.rewriteMap;
		var absoluteUrl = 'http://' + host + pathname;
		var proxyUrl = config.proxy + requestUrl;

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
			if (UTIL.isRegExp(rule) && rule.test(pathname) || typeof rule == 'string' && pathname.indexOf(rule) >= 0) {
				var newPathname = pathname.replace(rule, replaceText);
				printLocalFile(response, absoluteUrl, newPathname);
				return;
			}
		}

		// return remote file
		if (config.debug) {
			console.log('[get] ' + absoluteUrl + ', real URL:' + proxyUrl);
		}
		request.pipe(REQUEST(absoluteUrl)).pipe(response);

	}).listen(PORT);

	console.log('Rewrite Server runing at port: ' + PORT);
}

main();
