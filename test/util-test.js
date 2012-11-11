
var test = require('tap').test;

var util = require('../util');

test('util.parse (empty map)', function(t) {
	var map = [];

	var url = 'http://js.tudouui.com/js/lib/tuilib2_10.js';
	var result = util.parse(map, url);
	t.equal(result[0], 0);
	t.equal(result[1], 'http://js.tudouui.com/js/lib/tuilib2_10.js');

	t.end();
});

test('util.parse (replace partial URL)', function(t) {
	var map = [
		['http://js.tudouui.com/js/lib', 'http://css.tudouui.com/js/lib'],
		['/dist/', '/src/'],
	];

	var url = 'http://js.tudouui.com/js/lib/tuilib2_10.js';
	var result = util.parse(map, url);
	t.equal(result[0], 1);
	t.equal(result[1], 'http://css.tudouui.com/js/lib/tuilib2_10.js');

	var url = 'http://js.tudouui.com/js/dist/jquery.js';
	var result = util.parse(map, url);
	t.equal(result[0], 1);
	t.equal(result[1], 'http://js.tudouui.com/js/src/jquery.js');

	t.end();
});

test('util.parse (to local file)', function(t) {
	var root = 'D:\\project\\kindeditor';
	var localPath = require('path').resolve(root + '/kindeditor.js');

	var map = [
		['http://js.tudouui.com/js/lib/kindeditor-min.js', localPath],
	];

	var url = 'http://js.tudouui.com/js/lib/kindeditor-min.js';
	var result = util.parse(map, url);
	t.equal(result[0], 2);
	t.equal(result[1], 'D:\\project\\kindeditor\\kindeditor.js');

	t.end();
});

test('util.parse (to local file: partial URL)', function(t) {
	var root = 'D:\\project';
	var localPath = require('path').resolve(root + '/kindeditor/');

	var map = [
		['http://js.tudouui.com/js/lib', localPath],
	];

	var url = 'http://js.tudouui.com/js/lib/kindeditor.js';
	var result = util.parse(map, url);
	t.equal(result[0], 2);
	t.equal(result[1], 'D:\\project\\kindeditor\\kindeditor.js');

	t.end();
});