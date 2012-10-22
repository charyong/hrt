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
	// true时开启调试模式
	exports.debug = false;

	// 本地文件的根目录
	exports.root = 'D:\\Projects\\static-trunk';

	// 端口
	exports.port = 80;

	// 备用域名或代理，通过此域名下载远程文件
	exports.proxyHost = 'http://10.5.111.2:8085';

	// 重写所有请求
	exports.globalRewriteMap = [/([^?]+)_\d+(\.(?:js|css))/, '$1$2'];

	// 重写指定请求
	exports.rewriteMap = [
		['/js/lib/tuilib2', '/js/lib/tuilib2_combo'],
		['/js/page/channels/v2/ch.js', '/js/page/channels/v2/ch.js']
	];
	```

3. 启动调试服务。

	`tpm server`

代理服务器 httpd.conf
=================================================

```
NameVirtualHost *:8085
<VirtualHost *:8085>
	ServerName 10.5.111.2
	DocumentRoot "/home/github"
	RewriteEngine on
	RewriteRule ^(.*)$ http://js.tudouui.com/$1 [P]
</VirtualHost>
```