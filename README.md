HTTP Rewrite Tool
=================================================

HRT 是前端代理工具，根据配置把指定的URL指向到本地文件。

## 安装

1. 源代码安装
	```
	git clone git://github.com/tudouui/hrt.git
	```

2. NPM安装
	```
	npm install hrt -g
	```

## 使用方法

1. 修改浏览器代理设置，IP： `127.0.0.1` ，端口： `2222` 。

2. 创建配置文件 `./config/my.js` ，添加跳转规则。

	指定单个文件。
	```js
	var root = 'D:\\Projects\\static-trunk';
	exports.map = [
		['http://js.tudouui.com/js/lib/tuilib2.js', root + '/js/lib/tuilib2_combo.js']
	];
	```

	把整个目录指向到本地。
	```js
	var root = 'D:\\Projects\\static-trunk';
	exports.map = [
		['http://js.tudouui.com/js/lib', root + '/js/lib']
	];
	```

	移除版本号。
	```js
	exports.before = function(url) {
		return url.replace(/([^?]+)_\d+(\.(?:js|css))/, '$1$2');
	};
	```

	返回本地文件内容时，修改文件内容。
	```js
	var Mime = require('mime');
	var Util = require('../util');

	exports.merge = function(path, callback) {
		var contentType = Mime.lookup(path);
		// 所有JS头部添加注释
		if (/\.js$/.test(path)) {
			var content = Util.readFileSync(path, 'utf-8');
			return callback(contentType, '/* test /*\n' + content);
		}
		// 其它请求
		var buffer = Util.readFileSync(path);
		return callback(contentType, buffer);
	};
	```
	注：当配置文件里有 `exports.merge` 时会接管所有请求，所以在程序逻辑里需要加入文件类型判断。

3. 在命令行输入 `hrt` ，启动HTTP服务。

	```
	hrt --config=./config/my.js
	hrt --config=./config/my.js --port=8080
	hrt --config=./config/my.js --debug=true
	```