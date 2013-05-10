HTTP Rewrite Tool
=================================================

HRT是前端代理工具，根据配置把指定的URL指向到本地文件或远程URL。

### 安装

1. 源代码安装
	```
	git clone git://github.com/tudouui/hrt.git
	```

2. NPM安装
	```
	npm install hrt -g
	```

### 使用方法

1. 修改浏览器代理设置，IP：`127.0.0.1`，端口：`2222`，推荐用SwitchySharp（Chrome插件）、FoxyProxy（Firefox插件）切换代理。

2. 创建配置文件 `my-hrt-config.js` ，添加跳转规则。

	代理文件：
	```js
	exports.map = [
		['http://js.tudouui.com/v3/dist/js/g.js', 'D:\\project\\static\\trunk\\v3\\src\\js\\g.js']
	];
	```

	代理目录：
	```js
	exports.map = [
		['http://js.tudouui.com/v3/dist/js', 'D:\\project\\static\\trunk\\v3\\src\\js']
	];
	```

3. 在命令行输入 `hrt my-hrt-config.js` ，启动HTTP服务。

	```
	# 修改端口
	hrt my-hrt-config.js --port=8080
	# 输出调试信息
	hrt my-hrt-config.js --debug=true
	```

### 高级用法

1. 移除版本号。
	```js
	exports.before = function(url) {
		return url.replace(/([^?]+)_\d+(\.(?:js|css))/, '$1$2');
	};
	```

2. 修改文件内容。
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