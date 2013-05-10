HTTP Rewrite Tool
=================================================

HRT是前端代理工具，根据配置把指定的URL指向到本地文件。

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
	exports.map = [
		['http://js.tudouui.com/js/lib/tuilib2.js', 'D:\\Projects\\static-trunk\\js\\lib\\tuilib2_combo.js']
	];
	```

	把整个目录指向到本地。
	```js
	exports.map = [
		['http://js.tudouui.com/js/lib', 'D:\\Projects\\static-trunk\\js']
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
	exports.merge = function(path, callback) {
		// 所有JS头部添加注释
		if (/\.js$/.test(path)) {
			var content = Util.readFileSync(path, 'utf-8');
			return callback('application/javascript', '/* test /*\n' + content);
		}
		// 其它请求
		var contentType = require('mime').lookup(path);
		var buffer = this.util.readFileSync(path);
		return callback(contentType, buffer);
	};
	```
	注：当配置文件里有 `exports.merge` 时会接管所有请求，所以在程序逻辑里需要加入文件类型判断。

3. 在命令行输入 `hrt` ，启动HTTP服务。

	```
	hrt config/my.js
	hrt config/my.js --port=8080
	hrt config/my.js --debug=true
	```