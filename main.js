
var Http = require('http');
var Path = require('path');
var Fs = require('fs');
var Url = require('url');
var Mime = require('mime');
var Request = require('request');

var HttpProxy = require('./http-proxy');
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

if (ARGV.help || ARGV.h) {
	Optimist.showHelp();
	process.exit();
}

if (ARGV.version || ARGV.v) {
	var packageInfo = JSON.parse(Fs.readFileSync(__dirname + '/package.json', 'utf-8'));
	console.log(packageInfo.version);
	process.exit();
}

var PORT = Util.undef(ARGV.port, 2222);
var CONFIG_FILE = Util.undef(ARGV.config, __dirname + '/config/default.js');
var DEBUG = Util.undef(ARGV.debug, false);

CONFIG_FILE = Path.resolve(CONFIG_FILE);

var CONFIG = require(CONFIG_FILE);

function setResponse(response, contentType, buffer) {
	response.setHeader('Content-Type', contentType);
	response.write(buffer);
	response.end();
}

function main() {
	// reload config
	Fs.watch(CONFIG_FILE, function(event, filename) {
		if(event == 'change') {
			delete require.cache[CONFIG_FILE];
			CONFIG = require(CONFIG_FILE);
		}
	});

	// start server
	Http.createServer(function(request, response) {

		var url = request.url;
		var before = CONFIG.before;
		var map = CONFIG.map;
		var after = CONFIG.after;
		var merge = CONFIG.merge;

		var me = {
			config : CONFIG,
			util : Util,
			req : request,
			res : response,
		}

		if (DEBUG) {
			console.log('[get] ' + url);
		}

		var from = url;

		// static server
		if (!/^https?:\/\//.test(from)) {
			map = CONFIG.serverRoot;
			console.log(map, from, url);
		}

		if (before) {
			from = before.call(me, from);
		}

		var result = Util.rewrite(map, from);

		var type = result[0];
		var to = result[1];

		if (after) {
			to = after.call(me, to);
		}

		if (type > 0) {
			console.log('[rewrite] ' + url + ' -> ' + to);
		}

		if (type == 2) {
			if (merge) {
				merge.call(me, to, function(contentType, buffer) {
					setResponse(response, contentType, buffer);
				});
				return;
			}

			var contentType = Mime.lookup(to);
			var buffer = Util.readFileSync(to);

			setResponse(response, contentType, buffer);
			return;
		}

		var parsed = Url.parse(to);

		var proxy = new HttpProxy.HttpProxy({
			target : {
				host : parsed.hostname,
				port : parsed.port || 80,
			},
		});

		proxy.proxyRequest(request, response);

	}).listen(PORT);

	console.log('Rewrite Server runing at port: ' + PORT);
}

main();
