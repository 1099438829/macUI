/**
 * Created by Yuri2 on 2017/7/10.
 */
window.Macui = {
    _version: 'v1.1.2.6',
	_debug: true,
	_bgs: {
		main: '',
		mobile: '',
	},
	_wallpaperBlur: true, //壁纸模糊（影响性能）
	_countTask: 0,
    _maxTask:12,
	_newMsgCount: 0,
	_animated_classes: [],
	_animated_liveness: 0,
	_switchMenuTooHurry: false,
	_lang: 'unknown',
	_iframeOnClick: {
		resolution: 200,
		iframes: [],
		interval: null,
		Iframe: function () {
			this.element = arguments[0];
			this.cb = arguments[1];
			this.hasTracked = false;
		},
		track: function (element, cb) {
			this.iframes.push(new this.Iframe(element, cb));
			if (!this.interval) {
				let _this = this;
				this.interval = setInterval(function () { _this.checkClick(); }, this.resolution);
			}
		},
		checkClick: function () {
			if (document.activeElement) {
				let activeElement = document.activeElement;
				for (let i in this.iframes) {
					let eid = undefined;
					if ((eid = this.iframes[i].element.id) && !document.getElementById(eid)) {
						delete this.iframes[i];
						continue;
					}
					if (activeElement === this.iframes[i].element) { // user is in this Iframe
						if (this.iframes[i].hasTracked === false) {
							this.iframes[i].cb.apply(window, []);
							this.iframes[i].hasTracked = true;
						}
					} else {
						this.iframes[i].hasTracked = false;
					}
				}
			}
		}
	},
	_iframe_click_lock_children: {},
	_renderBar: function () {
		//调整任务栏项目的宽度
		if (this._countTask <= 0) { return; } //防止除以0
        let btns = $("#mac_btn_group_middle>.btn");
		btns.css('width', ('calc(' + (1 / this._countTask * 100) + '% - 1px )'))
	},
	_handleReady: [],
	_hideShortcut: function () {
        let that = $("#mac #mac-shortcuts .shortcut");
		that.removeClass('animated flipInX');
		that.addClass('animated flipOutX');
	},
	_showShortcut: function () {
        let that = $("#mac #mac-shortcuts .shortcut");
		that.removeClass('animated flipOutX');
		that.addClass('animated flipInX');
	},
	_checkBgUrls: function () {
        let loaders = $('#mac>.img-loader');
        let flag = false;
        if (Macui.isSmallScreen()) {
            if (Macui._bgs.mobile) {
                loaders.each(function () {
                    let loader = $(this);
                    if (loader.attr('src') === Macui._bgs.mobile && loader.hasClass('loaded')) {
                        Macui._setBackgroundImg(Macui._bgs.mobile);
                        flag = true;
                    }
                });
                if (!flag) {
                    //没找到加载完毕的图片
                    let img = $('<img class="img-loader" src="' + Macui._bgs.mobile + '" />');
                    $('#mac').append(img);
                    Macui._onImgComplete(img[0], function () {
                        img.addClass('loaded');
                        Macui._setBackgroundImg(Macui._bgs.mobile);
                    })
                }
            }
        } else {
            if (Macui._bgs.main) {
                loaders.each(function () {
                    let loader = $(this);
                    if (loader.attr('src') === Macui._bgs.main && loader.hasClass('loaded')) {
                        Macui._setBackgroundImg(Macui._bgs.main);
                        flag = true;
                    }
                });
                if (!flag) {
                    //没找到加载完毕的图片
                    let img = $('<img class="img-loader" src="' + Macui._bgs.main + '" />');
                    $('#mac').append(img);
                    Macui._onImgComplete(img[0], function () {
                        img.addClass('loaded');
                        Macui._setBackgroundImg(Macui._bgs.main);
                    })
                }
            }
        }

        //开始渲染壁纸模糊
        if (Macui._wallpaperBlur) {
            $('.background').addClass('blur');
        }
    },
    //动态加载JS文件
    loadScript: function (url, callback) {
        let el = document.createElement("script");
        el.type = "text/javascript";

        if (typeof (callback) != "undefined") {
            if (el.readyState) {
                el.onreadystatechange = function () {
                    if (el.readyState === "loaded" || el.readyState === "complete") {
                        el.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                el.onload = function () {
                    callback();
                };
            }
        }

        el.src = url;
        document.head.appendChild(el);
    },
    _startAnimate: function () {
        setInterval(function () {
            let classes_length = Macui._animated_classes.length;
            let animated_live_ness = Macui._animated_liveness;
            if (animated_live_ness === 0 || classes_length === 0 || !$("#mac-menu").hasClass(
                'opened')) {
                return;
            }
            $('#mac-menu>.blocks>.menu_group>.block').each(function () {
                if (!$(this).hasClass('onAnimate') && Math.random() <= animated_live_ness) {
                    let that = $(this);
                    let class_animate = Macui._animated_classes[Math.floor((Math.random() *
                        classes_length))];
                    that.addClass('onAnimate');
                    setTimeout(function () {
                        that.addClass(class_animate);
                        setTimeout(function () {
                            that.removeClass('onAnimate');
                            that.removeClass(class_animate);
                        }, 3000);
                    }, Math.random() * 2 * 1000)
                }
            })
        }, 1000);
    },
    _onImgComplete: function (img, callback) {
        if (!img) {
            return;
        }
        let timer = setInterval(function () {
            if (img.complete) {
                callback(img);
                clearInterval(timer);
            }
        }, 50)
    },
    _setBackgroundImg: function (img) {
        $('#mac .background').css('background-image', 'url(' + img + ')')
    },
    _settop: function (layero) {
        if (!isNaN(layero)) {
            layero = this.getLayeroByIndex(layero);
        }
        //置顶窗口
        let max_zindex = 0;
        $(".mac-open-iframe").each(function () {
            z = parseInt($(this).css('z-index'));
            $(this).css('z-index', z - 1);
            if (z > max_zindex) {
                max_zindex = z;
            }
        });
        layero.css('z-index', max_zindex + 1);
    },
    _checkTop: function () {
        let max_index = 0,
            max_z = 0,
            btn = null;
        $("#dock .dock-container li.show").each(function () {
            let index = $(this).attr('index');
            let layero = Macui.getLayeroByIndex(index);
            let z = layero.css('z-index');
            if (z > max_z) {
                max_index = index;
                max_z = z;
                btn = $(this);
            }
        });
        this._settop(max_index);
        $("#dock .dock-container li").removeClass('active');
        if (btn) {
            btn.addClass('active');
        }
    },
    //渲染右键
    _renderContextMenu: function (x, y, menu, trigger) {
        this._removeContextMenu();
        if (menu === true) {
            return;
        }
        let dom = $("<div class='mac-context-menu'><ul></ul></div>");
        $('#mac').append(dom);
        let ul = dom.find('ul');
        for (let i = 0; i < menu.length; i++) {
            let item = menu[i];
            if (item === '|') {
                ul.append($('<hr/>'));
                continue;
            }
            if (typeof (item) === 'string') {
                ul.append($('<li>' + item + '</li>'));
                continue;
            }
            if (typeof (item) === 'object') {
                let sub = $('<li>' + item[0] + '</li>');
                ul.append(sub);
                sub.click(trigger, item[1]);
            }
        }
        //修正坐标
        if (x + 150 > document.body.clientWidth) {
            x -= 150
        }
        if (y + dom.height() > document.body.clientHeight) {
            y -= dom.height()
        }
        dom.css({
            top: y,
            left: x,
        });
    },
    _removeContextMenu: function () {
        $('.mac-context-menu').remove();
    },
    _closeWin: function (index) {
        $("#mac_" + index).remove();
        layer.close(index);
        Macui._checkTop();
        Macui._countTask--; //回退countTask数
        Macui.renderDocks();
    },
    _fixWindowsHeightAndWidth: function () {
        //此处代码修正全屏切换引起的子窗体尺寸超出屏幕
        let opens = $('.mac-open-iframe');
        let clientHeight = document.body.clientHeight;
        opens.each(function () {
            let layero_opened = $(this);
            let height = layero_opened.css('height');
            height = parseInt(height.replace('px', ''));
            if (height + 30 >= clientHeight) {
                layero_opened.css('height', clientHeight - 30);
                layero_opened.find('.layui-layer-content').css('height', clientHeight - 62);
                layero_opened.find('.layui-layer-content iframe').css('height', clientHeight - 62);
            }
        })
    },

    /**
     * 原 #mac_bind_open_windows 子窗口事件自动绑定插件
     * @author:vG
     * @修订:Yuri2
     * @version:2.0.1
     * 说明: 所有#win10下的元素加入类win10-open-window即可自动绑定openUrl函数，无须用onclick手动绑定
     */
    _bind_open_windows: function () {
        // 注册事件委派 打开url窗口
        $('#mac').on('click', '.mac-open-window', function () {
            //>> 获取当前点击的对象
            $this = $(this);
            //>> 判断url地址是否为空 如果为空 不予处理
            if ($this.data('url') !== "") {
                //>> 获取弹窗标题
                let title = $this.data('title') || '',
                    areaAndOffset, icon;

                //>> 判断是否有标题图片
                let bg = $this.data('icon-bg') ? $this.data('icon-bg') : '';
                if ($this.data('icon-image')) {
                    //>> 加入到标题中
                    icon = '<img class="icon ' + bg + '" src="' + $this.data('icon-image') + '"/>';
                }
                if ($this.data('icon-font')) {
                    //>> 加入到标题中
                    icon = '<i class="fa fa-fw fa-' + $this.data('icon-font') + ' icon ' + bg +
                        '"></i>';
                }
                if (!title && $this.children('.icon').length === 1 && $this.children('.title')
                    .length === 1) {
                    title = $this.children('.title').html();
                    if (!icon) {
                        icon = $this.children('.icon').prop("outerHTML");
                    }
                }
                //>> 判断是否需要 设置 区域宽度高度
                if ($this.data('area-offset')) {
                    areaAndOffset = $this.data('area-offset');
                    //>> 判断是否有分隔符
                    if (areaAndOffset.indexOf(',') !== -1) {
                        areaAndOffset = eval(areaAndOffset);
                    }
                }
                //>> 调用win10打开url方法
                Macui.openUrl($this.data('url'), icon, title, areaAndOffset);
            }
        })
    },
    _init: function () {

        //获取语言
        this._lang = (navigator.language || navigator.browserLanguage).toLowerCase();

        $("#mac_btn_win").click(function () {
            Macui.commandCenterClose();
            Macui.menuToggle();
        });
        $("#mac_btn_command").click(function () {
            Macui.renderCommand();
            Macui.menuClose();
            Macui.commandCenterToggle();
        });
        $("#mac .desktop").click(function () {
            Macui.menuClose();
            Macui.commandCenterClose();
        });
        $('#mac').on('click', ".notice .btn_close_msg", function () {
            let msg = $(this).parents('.notice');
            $(msg).addClass('animated slideOutRight');
            setTimeout(function () {
                msg.remove()
            }, 500)
        });
        $("#mac .launchpad").click(function () {
            if ($("#launchpad").hasClass("hidden")) {
                Macui.renderLaunchpad();
                Macui.menuClose();
                Macui.commandCenterClose();
            } else {
                Macui.closeLaunchpad();
            }
        });
        //消息界面切换
        $('#mac_command_center').on('click', ".command-header div", function () {
            if (!$(this).hasClass('active')) {
                if ($(this).hasClass('tab-today')) {
                    $(this).parent().siblings('.msgs').hide().siblings('.today').show();
                    $(this).addClass('active').siblings('div').removeClass('active');
                } else {
                    $(this).parent().siblings('.today').hide().siblings('.msgs').show();
                    $(this).addClass('active').siblings('div').removeClass('active');
                }
            }
        });
        $('#mac_btn_command_center_clean_all').click(function () {
            let msgs = $('#mac_command_center .msg');
            msgs.addClass('animated slideOutRight');
            setTimeout(function () {
                msgs.remove()
            }, 1500);
            setTimeout(function () {
                Macui.commandCenterClose();
            }, 1000);
        });
        $("#mac_btn_show_desktop").click(function () {
            $("#mac .desktop").click();
            Macui.hideWins();
        });
        $("#mac-menu-switcher").click(function () {
            if (Macui._switchMenuTooHurry) {
                return;
            }
            Macui._switchMenuTooHurry = true;
            let class_name = 'mac-menu-hidden';
            let list = $("#mac-menu>.list");
            let blocks = $("#mac-menu>.blocks");
            let toggleSlide = function (obj) {
                if (obj.hasClass(class_name)) {
                    obj.addClass('animated slideInLeft');
                    obj.removeClass('animated slideOutLeft');
                    obj.removeClass(class_name);
                } else {
                    setTimeout(function () {
                        obj.addClass(class_name);
                    }, 450);
                    obj.addClass('animated slideOutLeft');
                    obj.removeClass('animated slideInLeft');
                }
            };
            toggleSlide(list);
            toggleSlide(blocks);
            setTimeout(function () {
                Macui._switchMenuTooHurry = false;
            }, 520)
        });
        $("#mac_btn_group_middle").click(function () {
            $("#mac .desktop").click();
        });
        $(document).on('click', '.layui-layer-refresh', function () {
            let index = $(this).attr('index');
            let iframe = Macui.getLayeroByIndex(index).find('iframe');
            iframe.attr('src', iframe.attr('src'));
        });
        $(document).on('mousedown', '.mac-open-iframe', function () {
            let layero = $(this);
            Macui._settop(layero);
            Macui._checkTop();
        });
        $('#mac_btn_group_middle').on('click', '.btn_close', function () {
            let index = $(this).parent().attr('index');
            Macui._closeWin(index);
        });
        $('#mac-menu .list').on('click', '.item', function () {
            let e = $(this);
            if (e.hasClass('has-sub-down')) {
                $('#mac-menu .list .item.has-sub-up').toggleClass('has-sub-down').toggleClass(
                    'has-sub-up');
                $("#mac-menu .list .sub-item").slideUp();
            }
            if (e.next().hasClass('sub-item')) {
                e.toggleClass('has-sub-down').toggleClass('has-sub-up');
            }
            while (e.next().hasClass('sub-item')) {
                e.next().slideToggle();
                e = e.next();
            }
        });
        setInterval(function () {
            //重新写mac时间
            let myDate = Macui.getLunarObj();
            $("#mac_btn_time").html(myDate.weekDay + myDate.hour + ':' + myDate.minute);
        }, 1000);
        //离开前警告
        document.body.onbeforeunload = function (event) {
            let rel = Macui.lang('系统可能不会保存您所做的更改', 'The system may not save the changes you have made.');
            if (!window.event) {
                event.returnValue = rel;
            } else {
                window.event.returnValue = rel;
            }
        };
        Macui.buildList(); //预处理左侧菜单
        Macui._startAnimate(); //动画处理
        Macui.renderShortcuts(); //渲染图标
        $("#mac-shortcuts").removeClass('shortcuts-hidden'); //显示图标
        Macui._showShortcut(); //显示图标
        Macui.renderDocks(); //渲染DOCK
        //初始化任务数量
        this._maxTask = parseInt((document.body.clientWidth - 10) / 60)
        //窗口改大小，重新渲染
        $(window).resize(function () {
            Macui.renderShortcuts();
            Macui._checkBgUrls();
            if (!Macui.isSmallScreen()) Macui._fixWindowsHeightAndWidth(); //2017年11月14日修改，加入了if条件
            Macui.renderDocks();
            this._maxTask = parseInt((parseInt(document.body.clientWidth) - 10) / 60)
        });
        //打广告
        setTimeout(function () {
            console.log(Macui.lang(
                '本页由Mac-UI强力驱动\n更多信息：https://mac.apecloud.cn \nMac-UI,轻松打造别具一格的后台界面 ',
                'The page is strongly driven by Mac-UI.\nFor more info: https://mac.apecloud.cn.\n Mac-UI, easy to create a unique background interface.'
            ))
        }, 2000);
        //点击清空右键菜单
        $(document).click(function (event) {
            if (!event.button)
                Macui._removeContextMenu();
        });
        //禁用右键的右键
        $(document).on('contextmenu', '.mac-context-menu', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        //设置默认右键菜单
        Macui.setContextMenu('#mac', true);
        Macui.setContextMenu('#mac>.desktop', [
            ['<i class="fa fa-fw fa-star"></i> 收藏本页', function () {
                let url = window.location;
                let title = document.title;
                let ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("360se") > -1) {
                    layer.alert(Macui.lang('您的浏览器不支持,请按 Ctrl+D 手动收藏!',
                        'Your browser does not support, please press Ctrl+D to manual collection!'
                    ));
                } else if (ua.indexOf("msie 8") > -1) {
                    window.external.AddToFavoritesBar(url, title); //IE8
                } else if (document.all) {
                    try {
                        window.external.addFavorite(url, title);
                    } catch (e) {
                        layer.alert(Macui.lang('您的浏览器不支持,请按 Ctrl+D 手动收藏!',
                            'Your browser does not support, please press Ctrl+D to manual collection!'
                        ));
                    }
                } else if (window.sidebar) {
                    window.sidebar.addPanel(title, url, "");
                } else {
                    layer.alert(Macui.lang('您的浏览器不支持,请按 Ctrl+D 手动收藏!',
                        'Your browser does not support, please press Ctrl+D to manual collection!'
                    ));
                }
            }],
            ['<i class="fa fa-fw fa-window-maximize"></i> ' + Macui.lang('进入全屏', 'Enable Full Screen'),
                function () {
                    Macui.enableFullScreen()
                }
            ],
            ['<i class="fa fa-fw fa-window-restore"></i> ' + Macui.lang('退出全屏', 'Disable Full Screen'),
                function () {
                    Macui.disableFullScreen()
                }
            ],
            '|',
            ['<i class="fa fa-fw fa-info-circle"></i> ' + Macui.lang('关于', 'About Us'), function () {
                Macui.aboutUs()
            }],
        ]);
        Macui.setContextMenu('#mac_btn_group_middle', [
            ['<i class="fa fa-fw fa-window-maximize"></i> ' + Macui.lang('全部显示', 'Show All Windows'),
                function () {
                    Macui.showWins()
                }
            ],
            ['<i class="fa fa-fw fa-window-minimize"></i> ' + Macui.lang('全部隐藏', 'Hide All Windows'),
                function () {
                    Macui.hideWins()
                }
            ],
            ['<i class="fa fa-fw fa-window-close"></i> ' + Macui.lang('全部关闭', 'Close All Windows'),
                function () {
                    Macui.closeAll()
                }
            ],
        ]);

        //处理消息图标闪烁
        setInterval(function () {
            let btn = $("#mac-msg-nof.on-new-msg");
            if (btn.length > 0) {
                btn.toggleClass('fa-commenting-o');
            }
        }, 600);

        //绑定快捷键
        $("body").keyup(function (e) {
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case 37: //left
                        $("#mac_btn_win").click();
                        break;
                    case 38: //up
                        Macui.showWins();
                        break;
                    case 39: //right
                        $("#mac_btn_command").click();
                        break;
                    case 40: //down
                        Macui.hideWins();
                        break;
                }
            }
        });
        //launchpad 搜索功能
        $("#launchpad .app-serach-box").on("click",function (e){
            //避免点击事件影响
            e.stopPropagation();
            $(this).find(".input-search").on("input propertychange", function (e) {
                //在输入框中打印输入的值
                var searchName = $(this).val();
                if (searchName === "") {
                    $("#app-shortcuts .shortcut").show();
                } else {
                    $("#app-shortcuts .shortcut").each(function () {
                        var appName = $(this).children(".title").text().toLowerCase();
                        if (appName.indexOf(searchName.toLowerCase()) !== -1) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                }
            });
        })

        /**
         * WIN10-UI v1.1.2.2 桌面舞台支持补丁
         * WIN10-UI v1.1.2.2之后的版本不需要此补丁
         * @usage 直接引用即可（需要jquery）
         * @author Yuri2
         */
        if ($("#mac-desktop-scene").length < 1) {
            $("#mac-shortcuts").css({
                position: 'absolute',
                left: 0,
                top: 30,
                'z-index': 100,
            });
            $("#mac .desktop").append(
                "<div id='mac-desktop-scene' style='width: 100%;height: 100%;position: absolute;left: 0;top: 0; z-index: 0;background-color: transparent;'></div>"
            )
        }

        //属性绑定
        Macui._bind_open_windows();
    },
    setBgUrl: function (bgs) {
        this._bgs = bgs;
        this._checkBgUrls();
    },
    setBg: function (bgs) {
        this._bgs = bgs;
        this._checkBgUrls();
    },
    menuClose: function () {
        $("#mac-menu").removeClass('opened').addClass('hidden');
        this._showShortcut();
        $(".mac-open-iframe").removeClass('hide');
    },
    getLunarObj: function () {
        //农历年信息
        let lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
            0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0,
            0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2,
            0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7,
            0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950,
            0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950,
            0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57,
            0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0,
            0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60,
            0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5,
            0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0,
            0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0,
            0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65,
            0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520,
            0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
        ];
        let Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        let Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        let Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

        //==== 传回农历 y年的总天数
        function lYearDays(y) {
            let i, sum = 348
            for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
            return (sum + leapDays(y))
        }

        //==== 传回农历 y年闰月的天数
        function leapDays(y) {
            if (leapMonth(y))
                return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
            else
                return (0)
        }

        //==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
        function leapMonth(y) {
            return (lunarInfo[y - 1900] & 0xf);
        }

        //==== 传回农历 y年m月的总天数
        function monthDays(y, m) {
            return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        }

        //==== 算出农历, 传入日期物件, 传回农历日期物件
        //      该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
        function Lunar(objDate) {
            let i, leap = 0,
                temp = 0
            let baseDate = new Date(1900, 0, 31)
            let offset = (objDate - baseDate) / 86400000

            this.dayCyl = offset + 40
            this.monCyl = 14

            for (i = 1900; i < 2050 && offset > 0; i++) {
                temp = lYearDays(i)
                offset -= temp
                this.monCyl += 12
            }
            if (offset < 0) {
                offset += temp;
                i--;
                this.monCyl -= 12
            }

            this.year = i
            this.yearCyl = i - 1864

            leap = leapMonth(i) //闰哪个月
            this.isLeap = false

            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月
                if (leap > 0 && i === (leap + 1) && this.isLeap === false) {
                    --i;
                    this.isLeap = true;
                    temp = leapDays(this.year);
                } else {
                    temp = monthDays(this.year, i);
                }

                //解除闰月
                if (this.isLeap === true && i === (leap + 1)) this.isLeap = false

                offset -= temp
                if (this.isLeap === false) this.monCyl++
            }

            if (offset === 0 && leap > 0 && i === leap + 1)
                if (this.isLeap) {
                    this.isLeap = false;
                } else {
                    this.isLeap = true;
                    --i;
                    --this.monCyl;
                }

            if (offset < 0) {
                offset += temp;
                --i;
                --this.monCyl;
            }

            this.month = i
            this.day = offset + 1
        }

        //获取农历（月）中文格式
        function get_lunar_month(month) {
            let fm = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
            return fm[month - 1];
        }

        //获取农历（日）中文格式
        function get_lunar_day(day) {
            let fd = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
            if (day <= 10) {
                return "初" + fd[day];
            } else if (day < 20) {
                return "十" + fd[day - 10];
            } else if (day === 20) {
                return "二十";
            } else if (day < 30) {
                return "廿" + fd[day - 20];
            } else {
                return "三" + fd[day - 30];
            }
        }

        //获取干支
        function get_ganzhi(year) {
            let num = year - 1900 + 36;
            return (Gan[num % 10] + Zhi[num % 12]);
        }

        //获取生肖
        function get_animal(year) {
            return Animals[(year - 4) % 12];
        }

        //获取周
        function get_weekday(date) {
            let values = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            return values[date.getDay()];
        }

        //获取星期
        function get_week(date) {
            let values = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            return values[date.getDay()];
        }

        //获取分钟
        function get_min(date) {
            let mins = date.getMinutes();
            if (mins < 10) {
                mins = '0' + mins
            }
            return mins;
        }

        //获取小时
        function get_hour(date) {
            let hour = date.getHours();
            let hours;
            if (hour < 6) {
                hours = '凌晨' + hour;
            } else if (hour < 9) {
                hours = '早上' + hour;
            } else if (hour < 12) {
                hours = '上午' + hour;
            } else if (hour < 14) {
                hours = '中午' + (hour - 12);
            } else if (hour < 17) {
                hours = '下午' + (hour - 12);
            } else if (hour < 19) {
                hours = '傍晚' + (hour - 12);
            } else if (hour < 22) {
                hours = '晚上' + (hour - 12);
            } else {
                hours = '深夜' + (hour - 12)
            }
            return hours;
        }

        let viewdate = {};
        let date = new Date();
        //秒
        viewdate.second = date.getSeconds();
        //分钟
        viewdate.minute = get_min(date);
        //小时
        viewdate.hour = get_hour(date);
        //日期
        viewdate.day = date.getDate();
        //星期
        viewdate.week = get_week(date);
        //星期
        viewdate.weekDay = get_weekday(date);
        //月
        viewdate.month = date.getMonth() + 1;
        //完整的年份(4位,1970-????)
        viewdate.fullYear = date.getFullYear();
        //年份(2位)
        viewdate.year = date.getYear();
        //农历信息
        let lunar_obj = new Lunar(date);
        //农历中文月
        viewdate.lunarmonth = get_lunar_month(lunar_obj.month);
        //农历中文日
        let lunar_day = Math.floor(lunar_obj.day);
        viewdate.lunarday = get_lunar_day(lunar_day);
        //农历年月日
        viewdate.lunar = lunar_obj.year + "-" + lunar_obj.month + "-" + lunar_day;
        //干支
        viewdate.ganzhi = get_ganzhi(lunar_obj.year);
        //生肖
        viewdate.animal = get_animal(lunar_obj.year);

        return viewdate;
    },
    //launchpad渲染
    renderLaunchpad: function () {
        $("#launchpad").removeClass("hidden").addClass("show").show();
        $("#mac-shortcuts").addClass('shortcuts-hidden'); //隐藏图标
        this.renderDocks(); //渲染DOCK
    },
    //close Launchpad
    closeLaunchpad: function () {
        if ($("#launchpad").hasClass("show")){
            $("#launchpad").removeClass("show").addClass("hidden").hide();
        }
    },
    //消息中心渲染
    renderCommand: function (todayHtml = null) {
        let active = $("#mac_command_center .command-body.today").hasClass('active');
        if (!active) {
            if (!todayHtml) {
                let lunarDate = Macui.getLunarObj();
                todayHtml = '<div class="command-body-calendar">\n' +
                    '	<div class="command-body-calendar-date normal-date">' + lunarDate.month + '月' +
                    lunarDate.day + '日 \n' + lunarDate.week + '</div>\n' +
                    '	<div class="command-body-calendar-date lunar-date">' + lunarDate.ganzhi + '年' +
                    lunarDate.lunarmonth + lunarDate.lunarday + '</div>\n' +
                    '</div>\n' +
                    '<div class="notice">' +
                    '	<div class="notice-header">' +
                    '		<span class="notice-header-icon"><img src="./img/icon/weather.png" class="notice-header-icon-img" /></span>\n' +
                    '		<span class="notice-header-title">天气</span>\n' +
                    '	</div>\n' +
                    '	<div class="notice-body">\n' +
                    '	<iframe scrolling="no" src="https://widget-page.qweather.net/h5/index.html?md=012&bg=1&lc=auto&key=4008bf181b5e4f349b2e516909430bf2&v=_1640448982399" frameborder="0" width="100%" height="400px" allowtransparency="true"></iframe>\n' +
                    '	</div>\n' +
                    '</div>\n';
            }
            $("#mac_command_center .command-body.today").html(todayHtml).addClass('active');
        }
    },
    menuOpen: function () {
        $("#mac-menu").addClass('opened').removeClass('hidden');
        //this._hideShortcut(); //不关闭
        $(".mac-open-iframe").addClass('hide');
    },
    menuToggle: function () {
        if (!$("#mac-menu").hasClass('opened')) {
            this.menuOpen();
        } else {
            this.menuClose();
        }
    },
    commandCenterClose: function () {
        $("#mac_command_center").addClass('hidden_right');
        this._showShortcut();
        $(".mac-open-iframe").removeClass('hide');
    },
    commandCenterOpen: function () {
        $("#mac_command_center").removeClass('hidden_right');
        //this._hideShortcut();
        $(".mac-open-iframe").addClass('hide');
        $("#mac-msg-nof").removeClass('on-new-msg fa-commenting-o');
    },
    renderShortcuts: function () {
        if (!this.isSmallScreen()) {
            //大屏执行pc的布局也就是竖排靠右对齐，小屏幕执行移动端也就是横向排列
            let h = parseInt(($("#mac #mac-shortcuts")[0].offsetHeight - 90) / 100);
            let w = 0;
            //计算一列最大几个图标，公式是（桌面图标界面的大小 - 顶部状态栏和底部dock栏的尺寸）/单个图标高度所占的尺寸
            let x = 0,
                y = 0;
            $("#mac #mac-shortcuts .shortcut").each(function () {
                $(this).css({
                    right: x * 82 + 10,
                    left: 'auto',
                    top: y * 100 + 10,
                });
                y++;
                if (y >= h) {
                    y = 0;
                    x++;
                }
            });
        } else {
            //小屏幕执行横屏
            let w = parseInt(($("#mac #mac-shortcuts")[0].offsetWidth - 10) / 82);
            let x = 0,
                y = 0;
            $("#mac #mac-shortcuts .shortcut").each(function () {
                $(this).css({
                    left: x * 82 + 10,
                    right: 0,
                    top: y * 100 + 10,
                });
                x++;
                if (x >= w) {
                    x = 0;
                    y++;
                }
            });
        }
    },
	//渲染DOCK
	renderDocks: function () {
		let cell_width = 60;
		let width = document.body.clientWidth;
		let docks = $("#dock .dock li");
		let max_num = parseInt(width / cell_width) - 1;
		for (let i = 0; i < docks.length; i++) {
			if (i > max_num) {
				docks.eq(i).css('display', 'none');
			} else {
				docks.eq(i).css('display', 'list-item');
			}
		}
		if (!this.isSmallScreen()) {
			$("#dock .dock-container li a img").hover(
				function () {
					$(this).parent('a').prev().css('display', 'flex');
				},
				function () {
					$(this).parent('a').prev().css('display', 'none');
				}
			);
		} else {
			$("#dock .dock-container li a img").hover(function () {
				$(this).parent('a').prev().css('display', 'none');
			});
		}
	},
    commandCenterToggle: function () {
        if ($("#mac_command_center").hasClass('hidden_right')) {
            this.commandCenterOpen();
        } else {
            this.commandCenterClose();
        }
    },
    newMsg: function (title, content, handle_click, app_name = '提示消息', app_icon =
        '<img src="./img/icon/weather.png" class="notice-header-icon-img" />', is_del = true) {
        let msg = '<div class="notice">' +
            '<div class="notice-header">' +
            '<span class="notice-header-icon">' + app_icon + '</span>' +
            '<span class="notice-header-title">' + app_name + '</span>';
        if (is_del) {
            msg += '<span class="btn_close_msg fa fa-times-circle"></span>';
        }
        msg += '</div>' +
            '<div class="notice-body">' +
            '<div class="msg">' +
            '<div class="title">' + title + '</div>' +
            '<div class="content">' + content + '</div>' +
            '</div></div></div>';
        let e = $(msg);
        $("#mac_command_center .msgs").prepend(e);
        e.find('.content:first,.title:first').click(function () {
            if (handle_click) {
                handle_click(e);
            }
        });
        layer.tips(Macui.lang('新消息:', 'New message:') + title, '#mac_btn_command', {
            tips: [1, 'rgba(0, 0, 0, 0.7)'],
            time: 3000
        });
        if ($("#mac_command_center").hasClass('hidden_right')) {
            $("#mac-msg-nof").addClass('on-new-msg');
        }
    },
    getLayeroByIndex: function (index) {
        return $('#' + 'layui-layer' + index)
    },
    isSmallScreen: function (size) {
        if (!size) {
            size = 768
        }
        let width = document.body.clientWidth;
        return width < size;
    },
    enableFullScreen: function () {
        let docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
    },
    disableFullScreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    buildList: function () {
        $("#mac-menu .list .sub-item").slideUp();
        $("#mac-menu .list .item").each(function () {
            if ($(this).next().hasClass('sub-item')) {
                $(this).addClass('has-sub-down');
                $(this).removeClass('has-sub-up');
            }
        })
    },
    openUrl: function (url, icon, title, areaAndOffset) {
		//只打开一个应用
		/*
		let ifr=document.getElementsByTagName("iframe");
		for(i=0;i<ifr.length;i++){
			if(url==ifr[i].src){
				Win10.show_win(url);
				return false;
			}
		}
		*/
		//只打开一个应用代码结束，备注，本地方法有点问题，需要全部使用 url才能生效
        if ($("#dock .dock-container").children('li').length > this._maxTask) {
            layer.msg("您打开的太多了，歇会儿吧~");
            return false;
        } else {
            this._countTask++;
        }
        if (!url) {
            url = '404'
        }
        url = url.replace(/(^\s*)|(\s*$)/g, "");
        let preg = /^(https?:\/\/|\.\.?\/|\/\/?)/;
        if (!preg.test(url)) {
            url = 'http://' + url;
        }
        if (!url) {
            url = '//yuri2.cn';
        }
        if (!title) {
            title = url;
        }
        let area, offset;
        if (this.isSmallScreen() || areaAndOffset === 'max') {
            area = ['100%', (document.body.clientHeight - 24) + 'px'];
            offset = ['24px', '0'];
        } else if (typeof areaAndOffset === 'object') {
            area = areaAndOffset[0];
            offset = areaAndOffset[1];
        } else {
            area = ['80%', '80%'];
            let topset, leftset;
            topset = parseInt($(window).height());
            topset = (topset - (topset * 0.8)) / 2 - 31;
            leftset = parseInt($(window).width());
            leftset = (leftset - (leftset * 0.8)) / 2 - 120;
            offset = [Math.round((this._countTask % 10 * 20) + topset) + 'px', Math.round((this
                ._countTask % 10 * 20 + 100) + leftset) + 'px'];
        }
        let index = layer.open({
            type: 2,
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            title: icon + title,
            content: url,
            area: area,
            offset: offset,
            isOutAnim: false,
            skin: 'mac-open-iframe',
            cancel: function (index, layero) {
                $("#mac_" + index).remove();
                Macui._checkTop();
                Macui._countTask--; //回退countTask数
                Macui._renderBar();
            },
            min: function (layero) {
                layero.hide();
                $("#mac_" + index).removeClass('show');
                Macui._checkTop();
                return false;
            },
            full: function (layero) {
                layero.find('.layui-layer-min').css('display', 'inline-block');
                layero_opened.css('top', 24);
            },
        });
        $('#dock .dock-container li.active').removeClass('active');
        let btn = $('<li  class="active show" id="mac_' + index + '" index="' + index +
            '"> <span class="dock-tips" style="display: none;">'+title+'<span class="arrow"></span></span><a>' + icon + '</a> </li>');
        let layero_opened = Macui.getLayeroByIndex(index);
        layero_opened.css('z-index', Macui._countTask + 813);
        Macui._settop(layero_opened);
        //菜单排列倒序
        layero_opened.find(".layui-layer-setwin>a").each(function () {
            if ($(this).hasClass('layui-layer-close')){
                $(this).prependTo(layero_opened.find(".layui-layer-setwin"));
            }
        })
        //重新定义菜单布局
        layero_opened.find('.layui-layer-setwin').append('<a class="layui-layer-ico layui-layer-refresh" index="' + index +
            '" href="#"></a>');
        layero_opened.find('.layui-layer-setwin .layui-layer-max').click(function () {
            setTimeout(function () {
                let height = layero_opened.css('height');
                height = parseInt(height.replace('px', ''));
                if (height >= document.body.clientHeight) {
                    layero_opened.css('height', height - 25);
                    layero_opened.find('.layui-layer-content').css('height', height -
                        55);
                    layero_opened.find('.layui-layer-content iframe').css('height',
                        height - 55);
                }
            }, 300);
        });
        //回收站存在则插入回收站之前不存在则直接追加
        if ($("#trashicon")){
            btn.insertBefore($("#trashicon"))
        }else{
            $("#dock .dock-container>li").append(btn);
        }
        Macui.renderDocks();
        btn.click(function () {
            console.log(444444)
            let index = $(this).attr('index');
            let layero = Macui.getLayeroByIndex(index);
            let settop = function () {
                //置顶窗口
                let max_zindex = 0;
                $(".mac-open-iframe").each(function () {
                    z = parseInt($(this).css('z-index'));
                    $(this).css('z-index', z - 1);
                    if (z > max_zindex) {
                        max_zindex = z;
                    }
                });
                layero.css('z-index', max_zindex + 1);
            };
            if ($(this).hasClass('show')) {
                console.log(444222)
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).removeClass('show');
                    Macui._checkTop();
                    layero.hide();
                } else {
                    $('#dock .dock-container li.active').removeClass('active');
                    $(this).addClass('active');
                    Macui._settop(layero);
                }
            } else {
                console.log(3333)
                $(this).addClass('show');
                $('#dock .dock-container li.active').removeClass('active');
                $(this).addClass('active');
                Macui._settop(layero);
                layero.show();
            }
        });

        Macui._iframeOnClick.track(layero_opened.find('iframe:first')[0], function () {
            if (Object.getOwnPropertyNames(Macui._iframe_click_lock_children).length === 0) {
                Macui._settop(layero_opened);
                Macui._checkTop();
            } else {
                console.log('click locked');
            }
        });

        this.menuClose();
        this.commandCenterClose();
        return index;
    },
    closeAll: function () {
        $(".mac-open-iframe").remove();
        $("#mac_btn_group_middle").html("");
        Macui._countTask = 0;
        Macui.renderDocks();
    },
    setAnimated: function (animated_classes, animated_liveness) {
        this._animated_classes = animated_classes;
        this._animated_liveness = animated_liveness;
    },
    exit: function () {
        layer.confirm(Macui.lang('确认要关闭本页吗?', 'Are you sure you want to close this page?'), {
            icon: 3,
            title: Macui.lang('提示', 'Prompt')
        }, function (index) {
            document.body.onbeforeunload = function () {
            };
            window.location.href = "about:blank";
            window.close();
            layer.close(index);
            layer.alert(Macui.lang('哎呀,好像失败了呢。', 'Ops...There seems to be a little problem.'), {
                skin: 'layui-layer-lan',
                closeBtn: 0
            });
        });

    },
    lang: function (cn, en) {
        return this._lang === 'zh-cn' || this._lang === 'zh-tw' ? cn : en;
    },
    aboutUs: function () {
        //关于我们
        layer.open({
            type: 1,
            closeBtn: 1, //不显示关闭按钮
            anim: 2,
            skin: 'mac-open-iframe',
            title: 'MAC-UI ' + this._version,
            shadeClose: true, //开启遮罩关闭
            area: ['320px', '200px'], //宽高
            content: '<div style="padding: 10px;font-size: 12px">' +
                '<p>支持组件:layer、jquery、animated.css、font-awesome</p>' +
                '<p>木子的忧伤、尤里2号©版权所有</p>' +
                '<p>作者邮箱:1099438829@qq.com</p>' +
                '</div>'
        });
    },
    setContextMenu: function (jq_dom, menu) {
        if (typeof (jq_dom) === 'string') {
            jq_dom = $(jq_dom);
        }
        jq_dom.unbind('contextmenu');
        jq_dom.on('contextmenu', function (e) {
            if (menu) {
                Macui._renderContextMenu(e.clientX, e.clientY, menu, this);
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
                e.stopPropagation();
            }
        });
    },
    hideWins: function () {
        $('#mac_btn_group_middle>.btn.show').each(function () {
            let index = $(this).attr('index');
            let layero = Macui.getLayeroByIndex(index);
            $(this).removeClass('show');
            $(this).removeClass('active');
            layero.hide();
        })
    },
    showWins: function () {
        $('#mac_btn_group_middle>.btn').each(function () {
            let index = $(this).attr('index');
            let layero = Macui.getLayeroByIndex(index);
            $(this).addClass('show');
            layero.show();
        });
        Macui._checkTop();
    },
    getDesktopScene: function () {
        return $("#mac-desktop-scene");
    },
    onReady: function (handle) {
        Macui._handleReady.push(handle);
    }
};


$(function () {
    Macui._init();
    for (let i in Macui._handleReady) {
        let handle = Macui._handleReady[i];
        handle();
    }
});
