// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function () {
    "use strict";

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        $('#get-weather-btn').click(getWeatherWithZipCode);
        
        getWeatherWithGeoLocation();

    };
   
    
    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
    };

    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
    };

    var myScroll, favScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
    var pullDownFlag, pullUpFlag;
    $(document).on("ready", function () {
        $("#pullDown").hide();
        $("#pullUp").hide();

        loadData();
    });
    /*初始化滚动*/
    function initScroll() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        pullDownFlag = 0;
        pullUpFlag = 0;
        myScroll = new IScroll('#wrapper', {
            scrollbars: false,      
            useTransition: false,
            probeType: 3,
            mouseWheel: true,//鼠标滑轮开启
            fadeScrollbars: true,//滚动条渐隐
            interactiveScrollbars: true,//滚动条可拖动
            shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩
            useTransform: true,//CSS转化
            useTransition: true,//CSS过渡
            bounce: true,//反弹
            freeScroll: false,//只能在一个方向上滑动
            startX: 0,
            startY: 0,
        });

        myScroll.on('scroll', positionJudge);
        myScroll.on("scrollEnd", action);
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
            capture: false,
            passive: false
        } : false);
    }
    function positionJudge() {
        if (this.y > 40) {    //判断下拉
            $("#pullDown").show();
            $("#pullDown").text = "放开刷新页面";
            pullDownFlag = 1;

        } else if (this.y < (this.maxScrollY - 40)) {   //判断上拉
            $("#pullUp").show();
            $("#pullUp").text = "放开刷新页面";
            pullUpFlag = 1;
        }
    }

    function action() {
        if (pullDownFlag == 1) {
            pullDownAction();
            pullDownFlag = 0;
            $("#pullDown").hide();
        } else if (pullUpFlag == 1) {
            pullUpAction();
            pullUpFlag = 0;
            $("#pullUp").hide();
        }
    }

    /**
     * scroll to refresh下拉刷新 
     * myScroll.refresh();// need to call after load数据加载完成后，调用界面更新方法
     */
    function pullDownAction() {
        console.log("pulldown");
    }

    /**
     * scroll to refresh下拉刷新 滚动翻页）
     * myScroll.refresh();		need to call after load
     */
    function pullUpAction() {
        console.log("pullup");
    }
    /*初始化加载数据*/
    function loadData() {
        //数据获取等待
        $.mobile.loading("show", {
            text: "数据加载中",
            textVisible: true,
            textonly: false
        });

        $.getJSON("json/loadContent.json", function (data) {
            var html = template('contentlist', data)
            $('#datalist').empty();
            document.getElementById('datalist').innerHTML = html;
            //需要刷新才能使用样式表
            $('#datalist').listview('refresh');
        }).fail(function (jqXHR) {

        }).success(function (result) {
            $.mobile.loading('hide');
            //页面加载成功后，才能初始化滚动
            initScroll();
           
        });
    }

    function isPassive() {
        var supportsPassiveOption = false;
        try {
            addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassiveOption = true;
                }
            }));
        } catch (e) { }
        return supportsPassiveOption;
    }
    
} )();