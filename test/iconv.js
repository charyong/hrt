
var fs = require('fs');
var iconv = require('iconv-lite');

var testPath = require('path').resolve(__filename, '..');

var utf8Buffer = fs.readFileSync(testPath + '/data/utf8.txt');

var utf8Str = iconv.fromEncoding(utf8Buffer, 'utf8');

var gbkBuffer = fs.readFileSync(testPath + '/data/gbk.txt');

var gbkStr = iconv.fromEncoding(gbkBuffer, 'gbk');

console.log(utf8Str, gbkStr);