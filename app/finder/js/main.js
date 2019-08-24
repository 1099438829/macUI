function finder(name,path,appObject) {
	
	// ajax请求sidebar数据
	$.ajax({
		url:'json/sidebar.json',
		type:'GET', // GET
		async:true, // 是否异步
		dataType:'json',
		success:function(data,textStatus,jqXHR){
			// 变量赋值
			favoritesTitle 	= data.data.favoritesTitle;
			favorites 		= data.data.favorites;
			devicesTitle	= data.data.devicesTitle;
			devices			= data.data.devices;
			delimiter 		= "<div style='height:10px;clear:both'></div>";

			favoritesHeaderHtml = "<ul><li class='title'>"+favoritesTitle+"</li>";
			favoritesBodyHtml	= '';
			$.each(favorites,function(key, value) {
				if(!name){
					//如果设置默认打开app,则以第一个为主
					name = value.name;
				}
				if(!path){
					//如果设置默认打开位置,则以第一个为主
					path = value.path;
				}
				favoritesBodyHtml = favoritesBodyHtml + 
				"<li>\
					<a onclick=\"finderOpenApp('"+value.name+"','"+value.path+"')\" class='"+value.active+"' href='#'>\
						<span class='"+value.icon+"'></span>\
						<span class='name'>"+value.title+"</span>\
					</a>\
				</li>";
			});
            favoritesFooterHtml = "</ul>";
			favoritesHtml = favoritesHeaderHtml+favoritesBodyHtml+favoritesFooterHtml;

			devicesHeaderHtml = "<ul><li class='title'>"+devicesTitle+"</li>";
			devicesBodyHtml	= '';
			$.each(devices,function(key, value) {
				devicesBodyHtml = devicesBodyHtml + 
				"<li>\
					<a onclick=\"finderOpenApp('"+value.name+"','"+value.path+"')\" class='"+value.active+"' href='#'>\
						<span class='"+value.icon+"'></span>\
						<span class='name'>"+value.title+"</span>\
					</a>\
				</li>";
			});
            devicesFooterHtml = "</ul>";
			devicesHtml = devicesHeaderHtml+devicesBodyHtml+devicesFooterHtml;

			$(".finder-wrapper .sidebar").html(favoritesHtml+delimiter+devicesHtml);

			if(path) {
				$('.finder-wrapper .pathHistory').val(path);
				$('.finder-wrapper .content').attr(path);
			} else {
				$('.finder-wrapper .content').attr('current-path','public/user/'+'administrator'+'/home/'); //administrator为用户名
			}
			finderOpenApp(name,path,appObject);

		},
		error:function(xhr,textStatus){
			console.log('错误')
		}
	});
	// scroll
	$(".sidebar").niceScroll({cursorcolor:"#bebebe"});
}



/**
 * 打开app，finder专用
 * @author tangtanglove
 */
function finderOpenApp(name,path,appObject) {
	// 保存历史记录
	pathHistory = $('.finder-wrapper .pathHistory').val();
	pathArray = new Array(); //定义一数组
	pathArray = pathHistory.split("|"); //字符分割 
	key = $.inArray(path, pathArray);

	if(key ==-1) {
		if(path) {
			lastPath = pathArray[pathArray.length-1];
			if(lastPath != 'root') {
				if(path.indexOf(lastPath) > -1) {
					pathHistory = pathHistory+'|'+path;
					$('.finder-wrapper .pathHistory').val(pathHistory);
					$('.finder-wrapper .currentPath').val(path);
					$('.finder-wrapper .content').attr('current-path',path);
				} else {
					// 将历史路径的最后一个路径替换新的路径
					pathHistory = pathHistory.replace(lastPath,path);
					// pathHistory = pathHistory+'|'+path;
					$('.finder-wrapper .pathHistory').val(pathHistory);
					$('.finder-wrapper .currentPath').val(path);
					$('.finder-wrapper .content').attr('current-path',path);
				}
			} else {
				pathHistory = pathHistory+'|'+path;
				$('.finder-wrapper .pathHistory').val(pathHistory);
				$('.finder-wrapper .currentPath').val(path);
				$('.finder-wrapper .content').attr('current-path',path);
			}
		}
	} else {
		$('.finder-wrapper .currentPath').val(path);
		$('.finder-wrapper .content').attr('current-path',path);
	}


	// ajax请求后台数据
	$.ajax({
		url:'json/openPath.json',
		type:'GET', // GET
		async:true, // 是否异步
		data:{
			path:path
		},
		dataType:'json',
		success:function(data,textStatus,jqXHR){
			if (data.status == 'success') {
				html = '';
				if(data.data) {
					$.each(data.data,function(key, value) {
						if(typeof(value.path)=="undefined") {
							value.path = '';
						}
						html = html + "<div class='app-box middle "+value.context+"' title='"+value.title+"' app-name='"+value.name+"' app-path='"+value.path+"' app-width="+value.width+" app-height="+value.height+">\
						<span class='app-icon'><img class='img-rounded' src='"+value.icon+"' alt='"+value.title+"' app-path='"+value.path+"' app-width="+value.width+" app-height="+value.height+"></span>\
						<span class='app-name'>"+value.title+"</span>\
						<div class='clear'></div>\
						</div>";
					});
				}
				$('.finder-wrapper .app-list').html(html);

			} else {
				layer.msg(data.msg,{zIndex: layer.zIndex,success: function(layero){layer.setTop(layero);}});
			}
		},
		error:function(xhr,textStatus){
			console.log('错误')
		}
	});

}

/**
 * 下一级
 * @author tangtanglove
 */
function next () {
	pathHistory = $('.finder-wrapper .pathHistory').val();
	currentPath = $('.finder-wrapper .currentPath').val();
	pathArray = new Array(); //定义一数组
	pathArray = pathHistory.split("|"); //字符分割 
	key = $.inArray(currentPath, pathArray);
	path = pathArray[key+1];
	if(path) {
		finderOpenApp('finder',path);
		$('.finder-wrapper .currentPath').val(path);
		$('.finder-wrapper .content').attr('current-path',path);
	}
}

/**
 * 上一级
 * @author tangtanglove
 */
function prev () {
	pathHistory = $('.finder-wrapper .pathHistory').val();
	currentPath = $('.finder-wrapper .currentPath').val();
	pathArray = new Array(); //定义一数组
	pathArray = pathHistory.split("|"); //字符分割 
	key = $.inArray(currentPath, pathArray);
	path = pathArray[key-1];
	if(path) {
		if(path=='root') {
			finderOpenApp('finder','');
		} else {
			finderOpenApp('finder',path);
		}
		$('.finder-wrapper .currentPath').val(path);
		$('.finder-wrapper .content').attr('current-path',path);
	}
}

// 系统点击事件
$(document).on("dblclick",'.finder-wrapper .app-box',function(event){
	finderOpenApp($(this).attr('app-name'),$(this).attr('app-path'),$(this));
});
$(document).on("mouseover",'.finder-wrapper .app-box',function(event){
	$(this).addClass('hover');
})
$(document).on("mouseout",'.finder-wrapper .app-box',function(event){
	$(this).removeClass('hover');
});
$(document).on("mousedown",'.finder-wrapper .app-box',function(event){
	$(".finder-wrapper .app-box").removeClass('active');
	$(this).addClass('active');
	return false;
});
$(document).on("mousedown",'.finder-wrapper .content',function(event){
	$(".finder-wrapper .app-box").removeClass('active');
})
$(document).on("mousedown",'.finder-wrapper .sidebar ul li a',function(event){
	$(".finder-wrapper .sidebar ul li a").removeClass('on');
	$(this).addClass('on');
})

finder();//系统调用开始