var helangSearch = {
	els: {},
	searchIndex: 0,
	hot: {
		color: ['#ff2c00', '#ff5a00', '#ff8105', '#fd9a15', '#dfad1c', '#6bc211', '#3cc71e', '#3cbe85', '#51b2ef', '#53b0ff'],
		list: ['木子的忧伤', 'macUI', '猿码云', 'apecloud.cn', 'win10ui', 'https://github.com/1099438829/macUI']
	},
	searchObj : [
		//废弃百度，百度不允许iframe
		// {
		// 	logo : 'img/baidu.png',
		// 	ico : 'img/ico_baidu.png',
		// 	title : '百度',
		// 	url : 'https://www.baidu.com/s?wd=',
		// },
		{
			logo : 'img/sougou.png',
			ico : 'img/ico_sougou.png',
			title : '搜狗',
			url : 'https://www.sogou.com/web?query=',
		},
		{
			logo : 'img/360.png',
			ico : 'img/ico_360.ico',
			title : '360',
			url : 'https://www.so.com/s?ie=utf-8&q=',
		},
		{
			logo : 'img/bing.png',
			ico : 'img/ico_bing.png',
			title : '必应',
			url : 'https://cn.bing.com/search?q=',
		},
		{
			logo : 'img/google.png',
			ico : 'img/ico_google.ico',
			title : '谷歌',
			url : 'https://www.google.com/search?q=',
		},
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
		function renderHotList(){
			_this.els.hotList.html(function() {
				var str = '';
				$.each(_this.hot.list, function(index, item) {
					str += '<a href="'+ _this.searchObj[_this.searchIndex].url + item + '" target="_self">' + '<div class="number" style="color: ' + _this.hot.color[index] + '">' + (index + 1) + '</div>' + '<div>' + item + '</div>' + '</a>';
				});
				return str;
			});
		};
		this.els.pickerList.html(function() {
			var str = '';
			$.each(_this.searchObj, function(index,item) {
				str += '<li style="background-image: url(' + item.ico + ')" data-logo="' + item.logo + '">' + item.title + '</li>';
			});
			return str;
		});
		var firstSearchObj = _this.searchObj[0];
		this.els.logo.css("background-image",'url('+ firstSearchObj.logo +')');
		this.els.pickerBtn.text(function() {
			renderHotList();
			return firstSearchObj.title;
		});
		
		this.els.pickerBtn.click(function() {
			if (_this.els.pickerList.is(':hidden')) {
				setTimeout(function() {
					_this.els.pickerList.show();
				}, 100);
			}
		});
		this.els.pickerList.on("click", ">li", function() {
			_this.els.logo.css("background-image", ('url(' + $(this).data("logo") + ')'));
			_this.searchIndex = $(this).index();
			_this.els.pickerBtn.html($(this).html());
			renderHotList();
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
			location.href = _this.searchObj[_this.searchIndex].url + _this.els.input.val();
		});
		$(document).click(function() {
			_this.els.pickerList.hide();
			_this.els.hotList.hide();
		});
	}
};