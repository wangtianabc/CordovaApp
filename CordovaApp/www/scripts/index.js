// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
//(function () {
/// <reference path="jquery-1.12.4.js">
/// <reference path="jquery.mobile-1.4.5.js">
define(['jquery', 'jquerymobile', 'iscrollprobe', 'template','url','util'], function ($,mobile,IScroll,template,url,my_$) {
    "use strict";
    var indexModule = {};
    var moduleName = "index module 01";
    var version = "1.0.0";
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
    //定义滚动相关变量
    var myScroll, favScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
    var pullDownFlag, pullUpFlag;
    //获取详细信息
    var getdetail = function (id) {
        $.mobile.changePage("#detail", { transition: "fade", changeHash: true });
        $.getJSON("json/desc.json", function (data) {
            var html = template('contentdesc', data)      
            $('#contentDetail').html(html);
        }).fail(function (jqXHR) {

        }).success(function (result) {

        });
    }
    
    //加载底部菜单
    function createFooter(page, id) {
        var footerUrl = page.attr("data-footer");
        if (footerUrl) {
            var footerHtml = '';
            if (!footerHtml) {
                footerHtml = my_$.loadContent(footerUrl,"GET","html");
                my_$.setItem(footerUrl, footerHtml);
            }
            page.append(footerHtml);
        }
    }
    
    //首页加载
    function pageHomeInit() {
        var pageId = $('#home').attr('id');
        createFooter($('#home'), pageId);
        $.mobile.pageContainer.trigger('create');

        $("#pullDown").hide();
        $("#pullUp").hide();
        loadData("json/loadContent.json", 1);
    }

    //用户信息加载
    function pageUserInit() {
        var pageId = $('#user').attr('id');
        createFooter($('#user'), pageId);
        $.mobile.pageContainer.trigger('create');
    }

    //文档加载
    var docReady = function () {
        $(document).ready(function () {
            $('#home').on('pageload', pageHomeInit());
            $('#user').on('pageload', pageUserInit());

            //自定义命名空间函数调用
            var myns = new my_$()
            myns.objectfunc();//实例方法
            my_$.staticfunc();//静态方法

            

            //获取地址中的参数
            //$('#detail').on('pageshow', function (e) {
            //    var curUrl = $.url();
            //    var itemid = $.url('?itemid');
            //    var test = $.url('?test');
            //});
            //$('.listitem').on('click', function () {
            //    $.mobile.changePage("#detail", { transition: "flip", changeHash: false });
            //});
            //$(document).on("#home", "pageinit", function () {
            //    console.log("pageinit");
            //$(document).on("pagebeforechange", beforechange);
            //});
            //function beforechange(e, data) {
            //    if (typeof data.toPage != "string") {
            //        var url = $.mobile.path.parseUrl(e.target.baseURI),
            //        re = /#detail/;
            //        if (url.href.search(re) != -1) {
            //            var page = $(e.target).find("#detail");
            //            var d = data.options.data;
            //            page.find("#s").append(decodeURIComponent(d));
            //        }
            //    }
            //}
        });
        
    };

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
        if (this.y > 30 & this.y < 60) {    //判断下拉
            $("#pullDown").show();
            pullDownFlag = 1;
        } else if (this.y > 60) {
            $("#pullDown").text("放开刷新页面");
        }else if (this.y < (this.maxScrollY - 30) & this.y>(this.maxScrollY-60)) {   //判断上拉
            $("#pullUp").show();
            pullUpFlag = 1;
        } else if (this.y < (this.maxScrollY - 60)) {
             $("#pullUp").text("放开刷新页面");
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
        myScroll.on('refresh');
    }

    /**
     * scroll to refresh下拉刷新 
     * myScroll.refresh();// need to call after load数据加载完成后，调用界面更新方法
     */
    function pullDownAction() {
        loadData("json/refreshContent.json", 1);
    }

    /**
     * scroll to refresh下拉刷新 滚动翻页）
     * myScroll.refresh();		need to call after load
     */
    function pullUpAction() {
        loadData("json/refreshContent.json", 2);
    }
    /*初始化加载数据*/
    function loadData(url,type) {
        //数据获取等待
        $.mobile.loading("show", {
            text: "数据加载中",
            textVisible: true,
            textonly: false
        });

        $.getJSON(url, function (data) {
            var html = template('contentlist', data)
            if (type == 1) {
                $('#datalist').empty();
                $('#datalist').html(html);
                //document.getElementById("datalist").innerHTML = html;
            } else {
                $('#datalist').append(html);
                //$('ul#datalist li:last').append(html);
            }
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

    return {
        "moduleName": "index module 01",
        "version":"1.0.0",
        docReady: docReady,
        getdetail: getdetail
    };

});