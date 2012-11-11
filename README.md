HTTP Rewrite Tool
=================================================

HRT 是前端代理工具，根据配置把指定的URL指向到本地或其它URL。

## 安装

```
git clone git://github.com/tudouui/hrt.git
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

	也可以把整个目录指向到本地。
	```js
	var root = 'D:\\Projects\\static-trunk';
	exports.map = [
		['http://js.tudouui.com/js/lib', root + '/js/lib']
	];
	```

	替换部分URL。
	```js
	exports.map = [
		['/dist/', '/src/']
	];
	```

3. 在命令行输入 `hrt` ，启动HTTP服务。

	```
	hrt --config=./config/my.js
	hrt --config=./config/my.js --port=8080
	hrt --config=./config/my.js --debug=true
	```