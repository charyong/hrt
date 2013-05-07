
exports.serverRoot = 'd:\\htdocs\\tudou.com\\static';

exports.map = [
	//线上环境
	//['http://js.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_src.js'],
	//['http://jstest.tudouui.com/js/page/play/v4/main.js', exports.serverRoot + '/js/page/play/v4/main_src.js'],
	//['http://js.tudouui.com/js/fn/flashloader2.js', exports.serverRoot + '/js/fn/flashloader2_src.js'],
	//['http://js.tudouui.com/js/page/play/v4/main.js', exports.serverRoot + '/js/page/play/v4/main_src.js'],
	//['http://js.tudouui.com/js/page/play/v4/comment.js', exports.serverRoot + '/js/page/play/v4/comment_src.js'],
	//['http://css.tudouui.com/skin/play/v4/play.css', exports.serverRoot + '/skin/play/v4/play_src.css'],

	//wwwtest环境
	//['http://jstest.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_src.js'],
	//['http://jstest.tudouui.com/js/fn/flashloader2.js', exports.serverRoot + '/js/fn/flashloader2_src.js'],
	//['http://jstest.tudouui.com/js/page/play/v4/main.js', exports.serverRoot + '/js/page/play/v4/main_src.js'],
	//['http://jstest.tudouui.com/js/page/play/v4/comment.js', exports.serverRoot + '/js/page/play/v4/comment_src.js'],
	//['http://csstest.tudouui.com/skin/play/v4/play.css', exports.serverRoot + '/skin/play/v4/play_src.css'],
	//['http://csstest.tudouui.com/skin/play/v4/img/pcapp.png', exports.serverRoot + '/skin/play/v4/img/pcapp.png'],
	 ['http://jstest.tudouui.com/bin/lingtong/PortalPlayer.swf', 'http://10.5.28.37/ad/tudouPlayer.swf'],
	//['http://jstest.tudouui.com/js/lib/tuilib2.js', 'http://js.tudouui.com/js/lib/tuilib2.js'],

];

exports.before = function(url) {
	var Tudou = this.util.loadPlugin('tudou');

	url = Tudou.stripVersionInfo(url);
	return url;
};

exports.merge = function(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');

	Tudou.mergeTui2.call(this, path, callback);
};
