Rewrite
=================================================

Rewrite 是前端调试工具，根据配置把指定的线上静态文件指向到本地。

## 安装

```
git clone git://github.com/tudouui/rewrite.git
```

## 使用方法

1. 修改浏览器代理设置，IP： `127.0.0.1` ，端口： `2222` 。

2. 创建配置文件 `./config/my.js` ，添加跳转规则。

	```js
	var root = 'D:\\Projects\\static-trunk';
	exports.map = [
		['http://js.tudouui.com/js/lib/tuilib2.js', root + '/js/lib/tuilib2_combo.js']
	];
	```

3. 在命令行输入 `rewrite` ，启动HTTP服务。

	```
	rewrite --config=./config/my.js
	rewrite --config=./config/my.js --port=8080
	rewrite --config=./config/my.js --debug=true
	```