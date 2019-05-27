/**
 * Created by libw on 2017/5/16.
 */
window.onload=function () {
    var l=document.querySelector(".left");
    var lc=document.querySelector(".left-content");
    var lt=document.querySelector(".left-title");
    var lh=l.clientHeight;
    var lth=lt.offsetHeight;
    lc.style.height=lh-lth+'px';

    var r=document.querySelector(".right");
    var rc=document.querySelector(".right-content");
    var rt=document.querySelector(".right-title");
    var rh=l.clientHeight;
    var rth=rt.offsetHeight;
    rc.style.height=rh-rth+'px';

    var rct=document.querySelector(".right-content-t");
    var rcc=document.querySelector(".right-content-c");
    var rcth=rct.offsetHeight;
    rcc.style.height=rh-rth-rcth+'px';

    // var xia=document.querySelector(".done-t>p");
    // var flag=true;
    // xia.click=function () {
    //     if(flag){
    //         xia.style.background="url('../images/xia.png')"
    //     }else {
    //         xia.style.background="url('../images/xia.png')"
    //     }
    //     flag=!flag;
    // }




//
};

var todo=angular.module('todo',[]);
todo.controller('ctrl',function ($scope,$filter) {
    var todo=[
        {
            id:1,
            title:'列表1',
            color:'red',
            todo:[
                {
                    title:'打球',
                    do:true,
                    time:''
                },
                {
                    title:'吃饭',
                    do:true,
                    time:''
                },
                {
                    title:'打扫',
                    do:false,
                    time:''
                },
                {
                    title:'编程',
                    do:true,
                    time:''
                },
                {
                    title:'聚餐',
                    do:false,
                    time:''
                }
            ]

        },
        {
            id:2,
            title:'列表2',
            color:'orange',
            todo:[
                {
                    title:'打球',
                    do:true,
                    time:''
                },
                {
                    title:'喝水',
                    do:true,
                    time:''
                },
                {
                    title:'接水',
                    do:false,
                    time:''
                },
                {
                    title:'运动',
                    do:false,
                    time:''
                }
            ]

        },
        {
            id:3,
            title:'列表3',
            color:'yellow',
            todo:[
                {
                    title:'打球',
                    do:true,
                    time:''
                },
                {
                    title:'作业',
                    do:false,
                    time:''
                },
                {
                    title:'出门',
                    do:true,
                    time:''
                },
                {
                    title:'做饭',
                    do:false,
                    time:''
                },
                {
                    title:'跑步',
                    do:false,
                    time:''
                },
            ]

        },
        {
            id:4,
            title:'列表4',
            color:'green',
            todo:[
                {
                    title:'打球',
                    do:true,
                    time:''
                },
                {
                    title:'作业',
                    do:false,
                    time:''
                },
                {
                    title:'出门',
                    do:true,
                    time:''
                },
                {
                    title:'做饭',
                    do:false,
                    time:''
                },
                {
                    title:'跑步',
                    do:false,
                    time:''
                },
            ]

        }
    ];
    var yanse=["red","orange","yellow","green","blue","pink","purple"];
    //获取点击的数据，然后赋值
    $scope.todo=todo;
    $scope.colors=yanse;
    $scope.todoList=function (i) {
        $scope.index=i;

        $scope.flag=false;
    };
    //点击展示&隐藏
    $scope.flag=false;
    $scope.isShow=function () {
        $scope.flag=!$scope.flag;
    };

    //获取最后一个下标
    $scope.index=$scope.todo.length-1;

    //左边列表的添加
    $scope.addList=function () {
        var id=$scope.todo.length;
        $scope.todo.push({
            id:id,
            title:'列表'+(id+1),
            color:yanse[id%7],
            todo:[]
        });
        $scope.index=$scope.todo.length;
        $scope.index=$scope.todo.length-1;


    };
    //右边内容的添加
    console.log($scope.todo.todo)
    $scope.addCon=function () {
        todo[$scope.index].todo.push({
            title:'',
            do:false,
            time:''
        })

    };
    //计数
    $scope.listNum=0;
    getlistnum();
    function getlistnum() {
        // $scope.index=$scope.ind;
        var arr=$filter('filter')($scope.todo[$scope.index].todo,true);

        $scope.listNum=arr.length;

    }
    //删除所有
    $scope.delAll=function () {
        var tds=$scope.todo[$scope.index].todo;
        $scope.todo[$scope.index].todo=tds.filter(function (v,i) {
            if(v.do==false){
                return true
            }
            return false
        });
        getlistnum();
    };
    //事件监听
    $scope.$watch("index",function () {
        getlistnum()
    });
    //点击切换地方
    $scope.qieClick=function (v,flag) {
        console.log(v)
        if(!flag){
            v.do=true;
        }else {
            v.do=false;
        }
        getlistnum();
    };
    //设置，点击颜色被选中

    $scope.selColor=function (c) {
        $scope.Scolor=c;

    };
    //点击消失
    $scope.showFlag=false;
    $scope.areShow=function () {
        $scope.showFlag=true;
        $scope.showTitle=todo[$scope.index].title;
        $scope.Scolor=todo[$scope.index].color;
    };
    //删除
    $scope.del=function (i) {
        $scope.todo.splice($scope.index,1);
        $scope.showFlag=false;
        $scope.index=$scope.todo.length-1;
    };
    //取消
    $scope.can=function () {
        $scope.showFlag=false;
    };
    //完成
    $scope.fin=function () {
        $scope.todo[$scope.index].title=$scope.showTitle;
        $scope.todo[$scope.index].color=$scope.Scolor;
        $scope.can();
    }
});