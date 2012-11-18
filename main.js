
var HTTP = require('http');
var URL = require('url');
var PATH = require('path');
var FS = require('fs');

var MIME = require('mime');
var REQUEST = require('request');

var UTIL = require('./util');

var OPTIMIST = require('optimist');

OPTIMIST.usage([
	'Usage: rewrite --config=[/path/to/config.js] --port=[number] --debug=[true/false]\n\n',
	'Examples:\n',
	'rewrite --config=./config/my.js\n',
	'rewrite --config=./config/my.js --port=8080\n',
	'rewrite --config=./config/my.js --debug=true',
].join(''));

var ARGV = OPTIMIST.argv;

if (ARGV.help) {
	OPTIMIST.showHelp();
	process.exit();
}

var PORT = UTIL.undef(ARGV.port, 2222);
var CONFIG_FILE = UTIL.undef(ARGV.config, __dirname + '/config/default.js');
var DEBUG = UTIL.undef(ARGV.debug, false);

CONFIG_FILE = PATH.resolve(CONFIG_FILE);

var CONFIG = require(CONFIG_FILE);

function main() {
	// reload config
	FS.watch(CONFIG_FILE, function(event, filename) {
		if(event == 'change') {
			delete require.cache[CONFIG_FILE];
			CONFIG = require(CONFIG_FILE);
		}
	});

	// start server
	HTTP.createServer(function(request, response) {

		var headers = request.headers;
		var host = headers.host;
		var requestUrl = request.url;
		var pathname = URL.parse(requestUrl).pathname;

		var before = CONFIG.before;
		var map = CONFIG.map;
		var after = CONFIG.after;

		var url = 'http://' + host + pathname;

		if (DEBUG) {
			console.log('[get] ' + url);
		}

		var from = url;

		if (before) {
			from = before(from);
		}

		var result = UTIL.rewrite(map, from);

		var type = result[0];
		var to = result[1];

		if (after) {
			to = after(to);
		}

		if (type > 0) {
			console.log('[rewrite] ' + url + ' -> ' + to);
		}

		if (type == 2) {
			//request.pipe(FS.createWriteStream(to).pipe(REQUEST(url))).pipe(response);
			FS.createReadStream(to).pipe(request).pipe(response);
			return;
		}

		request.pipe(REQUEST(to)).pipe(response);

	}).listen(PORT);

	console.log('Rewrite Server runing at port: ' + PORT);
}

main();
