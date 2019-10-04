var helangSearch = {
	els: {},
	searchIndex: 0,
	hot: {
		color: ['#ff2c00', '#ff5a00', '#ff8105', '#fd9a15', '#dfad1c', '#6bc211', '#3cc71e', '#3cbe85', '#51b2ef', '#53b0ff'],
		list: ['1099438829@qq.com', 'qq:1099438829', '木子的忧伤', 'macUI', '猿码云', 'apecloud.cn', 'win10ui', 'https://github.com/1099438829/macUI']
	},
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
				str += '<a href="https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd=' + item + '" target="_blank">' + '<div class="number" style="color: ' + _this.hot.color[index] + '">' + (index + 1) + '</div>' + '<div>' + item + '</div>' + '</a>';
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
			var searchArr = ['百度', '搜狗', '必应', '谷歌'];
			alert(searchArr[_this.searchIndex] + "搜索：" + _this.els.input.val());
		});
		$(document).click(function() {
			_this.els.pickerList.hide();
			_this.els.hotList.hide();
		});
	}
};