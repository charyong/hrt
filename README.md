前端调试服务器
=================================================

TPM 是前端调试服务器，通过配置把线上资源文件指向到本地。

## 使用方法

1. 修改本地 hosts 文件，把域名指向到本地。

	```
	127.0.0.1 js.tudouui.com
	127.0.0.1 css.tudouui.com
	```

2. 修改 config.js 文件，添加跳转规则。

	```js
	exports.root = '/path/to/static';

	exports.map = [
		['http://js.tudouui.com/js/lib', 'js/lib']
	];
	```

3. 启动调试服务。

	`tpm server`