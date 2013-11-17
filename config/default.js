
exports.serverRoot = 'd:\\work\\static';

exports.map = [
	//线上环境
	//['http://js.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_src.js'],
	//['http://js.tudouui.com/js/page/play/v4/main.js', exports.serverRoot + '/js/page/play/v4/main_src.js'],
	//['http://js.tudouui.com/js/delate.js', exports.serverRoot + '/js/delate_src.js'],
	//['http://css.tudouui.com/skin/play/v4/play.css', exports.serverRoot + '/skin/play/v4/play_combo.css'],
	//['http://js.tudouui.com/js/fn/flashloader2.js', exports.serverRoot + '/js/fn/flashloader2.js'],
	//['http://js.tudouui.com/js/page/play/v4/comment.js', exports.serverRoot + '/js/page/play/v4/comment_combo.js'],
	//['http://css.tudouui.com/skin/play/v4/img/icon_wt5.png', exports.serverRoot + '/skin/play/v4/img/icon_wt5.png'],
	 //['http://js.tudouui.com/bin/lingtong/PortalPlayer.swf', 'http://jstest.tudouui.com/bin/lingtong/PortalPlayer_adtest_12.swf'],
	//['http://css.tudouui.com/skin/play/v4/img/bg_v7.png', exports.serverRoot + '/skin/play/v4/img/bg_v7.png'],

	//wwwtest环境
	//['http://jstest.tudouui.com/js/lib/tuilib2.js', 'http://jstest.tudouui.com/js/lib/tuilib2_298.js'],
	['http://jstest.tudouui.com/js/lib/tuilib2.js', exports.serverRoot + '/js/lib/tuilib2_combo.js'],
	//['http://csstest.tudouui.com/skin/__g/__g.css', exports.serverRoot + '/skin/__g/__g_src.css'],
	//['http://wwwtest.tudou.com/feeportal/hasRule.html', 'http://localhost/json.php'],
	['http://jstest.tudouui.com/js/fn/flashloader2.js', exports.serverRoot + '/js/fn/flashloader2_src.js'],
	['http://jstest.tudouui.com/js/page/play/v4/main.js', exports.serverRoot + '/js/page/play/v4/main_src.js'],
	['http://jstest.tudouui.com/js/page/play/v4/comment.js', exports.serverRoot + '/js/page/play/v4/comment_src.js'],
	['http://csstest.tudouui.com/skin/play/v4/play.css', exports.serverRoot + '/skin/play/v4/play_src.css'],
	//['http://csstest.tudouui.com/skin/play/v4/img/bg_v8.png', exports.serverRoot + '/skin/play/v4/img/bg_v8.png'],
	//['http://csstest.tudouui.com/skin/play/v4/img/icon_wt5.png', exports.serverRoot + '/skin/play/v4/img/icon_wt5.png'],
	//['http://jstest.tudouui.com/v3/dist/js/autodomain.js', exports.serverRoot + '/autodomain.js'],
	//['http://csstest.tudouui.com/skin/play/v4/img/nocomment_2.png', exports.serverRoot + '/skin/play/v4/img/nocomment_2.png'],
	 //['http://jstest.tudouui.com/bin/lingtong/PortalPlayer.swf', exports.serverRoot + '/bin/lingtong/PortalPlayer_WT1.swf'],

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
