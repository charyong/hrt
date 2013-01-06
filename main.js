
var HttpProxy = require('http-proxy');
var Path = require('path');
var Fs = require('fs');
var Url = require('url');
var Mime = require('mime');

var Util = require('./util');

var Optimist = require('optimist');

Optimist.usage([
	'Usage: rewrite --config=[/path/to/config.js] --port=[number] --debug=[true/false]\n\n',
	'Examples:\n',
	'rewrite --config=./config/my.js\n',
	'rewrite --config=./config/my.js --port=8080\n',
	'rewrite --config=./config/my.js --debug=true',
].join(''));

var ARGV = Optimist.argv;

if (ARGV.help) {
	Optimist.showHelp();
	process.exit();
}

var PORT = Util.undef(ARGV.port, 2222);
var CONFIG_FILE = Util.undef(ARGV.config, __dirname + '/config/default.js');
var DEBUG = Util.undef(ARGV.debug, false);

CONFIG_FILE = Path.resolve(CONFIG_FILE);

var CONFIG = require(CONFIG_FILE);

function main() {
	// reload config
	Fs.watch(CONFIG_FILE, function(event, filename) {
		if(event == 'change') {
			delete require.cache[CONFIG_FILE];
			CONFIG = require(CONFIG_FILE);
		}
	});

	// start server
	HttpProxy.createServer(function(request, response, proxy) {

		var url = request.url;
		var before = CONFIG.before;
		var map = CONFIG.map;
		var after = CONFIG.after;

		if (DEBUG) {
			console.log('[get] ' + url);
		}

		var from = url;

		if (before) {
			from = before(from);
		}

		var result = Util.rewrite(map, from);

		var type = result[0];
		var to = result[1];

		if (after) {
			to = after(to);
		}

		if (type > 0) {
			console.log('[rewrite] ' + url + ' -> ' + to);
		}

		if (type == 2) {
			var contentType = Mime.lookup(to);

			var buffer = Util.readFileSync(to);

			response.setHeader("Content-Type", contentType);
			response.write(buffer);
			response.end();
			return;
		}

		var urlObj = Url.parse(to);

		proxy.proxyRequest(request, response, {
			host: urlObj.hostname,
			port: urlObj.port || 80
		});

	}).listen(PORT);

	console.log('Rewrite Server runing at port: ' + PORT);
}

main();
