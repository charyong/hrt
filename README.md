Tudou Package Manager
===

ʹ�÷�����

1. �޸ı��� hosts �ļ���������ָ�򵽱��ء�

	```
	127.0.0.1 js.tudouui.com
	127.0.0.1 css.tudouui.com
	```

2. �޸� config.js �ļ��������ת����

	```js
	var staticPath = '/path/to/static';

	var rewriteRules = [
		['http://js.tudouui.com/js/lib', 'js/lib']
	];
	```

3. �������Է���

	`tpm server`
