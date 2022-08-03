/**
 * Created by Yuri2 on 2017/7/31.
 */
//此处代码适合在子页面使用
window.Macui_parent=parent.Macui; //获取父级Macui对象的句柄
window.Macui_child={
    close:function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        Macui_parent._closeWin(index);
    },
    newMsg: function (title, content,handle_click){
        Macui_parent.newMsg(title, content,handle_click)
    },
    openUrl: function (url, title,max){
        var click_lock_name=Math.random();
        Macui_parent._iframe_click_lock_children[click_lock_name]=true;
        var index=Macui_parent.openUrl(url, title,max);
        setTimeout(function () {
            delete Macui_parent._iframe_click_lock_children[click_lock_name];
        },1000);
        return index;
    }
};

