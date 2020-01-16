var helangSearch = {
	els: {},
	searchIndex: 0,
	hot: {
		color: ['#ff2c00', '#ff5a00', '#ff8105', '#fd9a15', '#dfad1c', '#6bc211', '#3cc71e', '#3cbe85', '#51b2ef', '#53b0ff'],
		list: ['木子的忧伤', 'macUI', '猿码云', 'apecloud.cn', 'win10ui', 'https://github.com/1099438829/macUI']
	},
	searchArr : [
        'https://www.baidu.com/s?ie=UTF-8&wd=',//百度
 		'https://www.sogou.com/web?query=', //搜狗
		'https://cn.bing.com/search?q=', //必应
		'https://www.google.com/search?q=',//谷歌
	],
	init: function() {
		var _this = this;
		this.els = {
			pickerBtn: $(".picker"),
			pickerList: $(".picker-list"),
			logo: $(".logo"),
			hotList: $(".hot-list"),
			input: $("#search-input"),
			button: $(".search")
		};
		this.els.hotList.html(function() {
			var str = '';
			$.each(_this.hot.list, function(index, item) {
				str += '<a href="'+_this.searchArr[_this.searchIndex] + item + '" target="_self">' + '<div class="number" style="color: ' + _this.hot.color[index] + '">' + (index + 1) + '</div>' + '<div>' + item + '</div>' + '</a>';
			});
			return str;
		});
		this.els.pickerBtn.click(function() {
			if (_this.els.pickerList.is(':hidden')) {
				setTimeout(function() {
					_this.els.pickerList.show();
				}, 100);
			}
		});
		this.els.pickerList.on("click", ">li", function() {
			_this.els.logo.css("background-image", ('url(img/' + $(this).data("logo") + ')'));
			_this.searchIndex = $(this).index();
			_this.els.pickerBtn.html($(this).html())
		});
		this.els.input.click(function() {
			if (!$(this).val()) {
				setTimeout(function() {
					_this.els.hotList.show();
				}, 100);
			}
		});
		this.els.input.on("input", function() {
			if ($(this).val()) {
				_this.els.hotList.hide();
			}
		});
		this.els.button.click(function() {
			location.href = _this.searchArr[_this.searchIndex] + _this.els.input.val();
		});
		$(document).click(function() {
			_this.els.pickerList.hide();
			_this.els.hotList.hide();
		});
	}
};