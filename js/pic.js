
function AutoClubBigPic(options){
    var that = this;
    that.options = options;

    that.config = {
        hideEle: {
            first: "#test"
        },
        containEle: "#topicEle",
        loadingEle: "#loading",
        scrollTop: 0,
        title: "帖子标题",
        index: 1,
        imgsrc: "",
        topicId: 0,
        replyId: 0,
        callback: function () {},
        gaq: ""
    };

    that.eleConfigs = {
        headerEle: "div[data-header]",
        bottomEle: "div[data-bottom]",
        titleEle: "h2[data-title]",
        closeEle: "a[data-close]",
        focusEle: "div[data-focus]",
        itemsEle: "div[data-items]",
        relContainEle: "ul[data-relation='list']",
        singleImgEles: "div[data-img]",
        prevBtn: 'a[data-btn="prev"]',
        nextBtn: 'a[data-btn="next"]',
        downloadEle: "a[data-download]",
        relationEle: "ul[data-relation] a[data-replyId] ",
        bottomPage: "span[data-bottomPage]",
        firstEle: "div[data-itemid='first'] img",
        firstParentEle: "div[data-itemid='first']",
        firstConEle: "div[data-item='first']",
        secondEle: "div[data-itemid='seconed'] img",
        secondParentEle: "div[data-itemid='seconed']",
        secondConEle: "div[data-item='seconed']",
        threeEle: "div[data-itemid='three'] img",
        threeParentEle: "div[data-itemid='three']",
        threeConEle: "div[data-item='three']",
        nextTip: "div[data-tip='nexttip']",
        lastPic: "div[data-tip='lastpic']",
        collection : "a[data-collection='collection']",
        back : "a[data-back='back']"
    };

    that.swip = null;
    that.imgList = null;
    that.imgStateArray = null;
    that.currentImgSrc = "";
    that.currentIndex = 0;
    that.cacheData = {};
    that.cachePicListData = {};
    that.relationData = {};
    that.cacheHtml = {};
    that.startPoint = {};
    that.endPoint = {};
    that.touchObj = {};
    that.touchGestureObj = {}
    //开关
    that.oBtn = false;

    //配置参数
    that.options = $.extend(this.config,options);

    //收藏图片
    that.url = '';
};

var touchStartHandler,
    touchEndHandler,
    touchMoveHandler,

    selfGestureObj,
    touchGestureStartHandler,
    touchGestureMoveHandler,
    touchGestureEndHandler,
    gestureFlag = false,
    gestureScale = 0,

    shiftPointX = 0,
    shiftPointY = 0,
    lastShiftPointX = 0,
    lastShiftPointY = 0,
    hammertime,

    hitCount = 0;

function widget(W,H){
    var iHtml = '<div class="widget">';
        iHtml +=
            '<div class="w-viewimg-nav w-viewimg-nav-top" data-header="1"><h2 class="wvi-nav-title" data-title="1"></h2><a href="javascript:void(0)" data-close="1" class="wvi-nav-close">返回</a></div>';
        iHtml += '<div class="w-viewimg-focus" data-focus="1">';
        iHtml += '  <div class="wvi-slide" data-items="list">';
        iHtml += '<div class="wvi-item" data-item="first">';
        iHtml += '  <div class="wvi-imgbox">';
        iHtml += '      <div class="wvi-imgself" data-itemid="first"><span><img style="max-width:' + W + "px; max-height:" + H +
            'px; width:auto; height:auto;"/></span></div>';
        iHtml += "     </div>";
        iHtml += "</div>";
        iHtml += '<div class="wvi-item" data-item="seconed">';
        iHtml += '  <div class="wvi-imgbox">';
        iHtml += '      <div class="wvi-imgself" data-itemid="seconed"><span><img style="max-width:' + W + "px; max-height:" +
            H + 'px; width:auto; height:auto;"/></span></div>';
        iHtml += "     </div>";
        iHtml += "</div>";
        iHtml += '<div class="wvi-item" data-item="three">';
        iHtml += '  <div class="wvi-imgbox">';
        iHtml += '      <div class="wvi-imgself" data-itemid="three"><span><img style="max-width:' + W + "px; max-height:" + H +
            'px; width:auto; height:auto;"/></span></div>';
        iHtml += "     </div>";
        iHtml += "</div>";
        iHtml += "</div>";
        iHtml += "</div>";
        iHtml += ' <div class="w-viewimg-mark" style="display:none;" data-page="1">1/40</div>';
        iHtml += '<div class="w-viewimg-nav w-viewimg-nav-bottom" data-bottom="1">';
        iHtml += '   <a href="javascript:void(0)" class="wvi-nav-close" data-close="2">返回</a>';
        iHtml += '   <a href="javascript:void(0)" class="wvi-nav-collection" data-collection="collection">收藏</a>';
        iHtml += '   <a href="javascript:void(0)" class="wvi-nav-back" data-back="back">返回收藏</a>';
        iHtml +=
            '   <a href="javascript:void(0)" class="wvi-nav-download" data-download="pic"><i class="w-icon w-download"></i></a>';
        iHtml +=
            '<div class="w-viewimg-page-prevnext"><a class="wvi-prev" href="javascript:void(0)" data-btn="prev"><i class="w-icon w-arrow-left"></i></a>';
        iHtml += '  <a class="wvi-next" href="javascript:void(0)" data-btn="next"><i class="w-icon w-arrow-right"></i></a>';
        iHtml += '   <span class="wvi-number" data-bottomPage="bottom"><b></b></span>';
        iHtml += "</div>";
        iHtml += "</div>";
        iHtml +=
            ' <div class="wvi-tip-layer" style="display:none;" data-tip="lastpic"><span class="wvi-tip01-layer"><i class="w-icon w-ok"></i>已经是最后一张图了</span></div>';
        iHtml +=
            '<div class="wvi-tip-layer" style="display:none;" data-tip="nexttip"><span class="wvi-tip01-layer">你正在浏览下一篇文章</span></div>';
        iHtml += "</div>";
        return iHtml
};

function imgbox(pos,w,h){
    var html = '   <div class="wvi-imgbox">';
        html += '      <div class="wvi-imgself" data-itemid="' + pos + '"><span><img style="max-width:' + w + "px; max-height:" +
            h + 'px; width:auto; height:auto;"/></span></div>';
        html += "     </div>";

    return html;
};

window.bigPicsTemplate = {
    mainTemplate : widget,
    templatePic : imgbox,
};

var Auto = Auto || {};
Auto["animate1"] = function (arg, speed, callback) {
    this.elem = "string" == typeof arg.elem ? document.getElementById(arg.elem) : arg.elem;
    if (this.elem == null) {
        return
    }
    this.timers = [];
    this.prop = "left" in arg ? "left" : "top" in arg ? "top" : "height" in arg ? "height" : "";
    var from = eval(this.elem.style[this.prop].replace("px", ""));
    var to = arg[this.prop];

    //时间
    this.options = {
        duration: speed ? speed : 300
    };
    this.callback = function () {};
    if (typeof callback == "function") {
        this.callback = callback
    }
    if (speed == 0) {
        this.step(true)
    } else {
        this.custom(from, to)
    }
    return this
};
Auto["animate1"].prototype = {
    easing: {
        linear: function (p, n, firstNum, diff) {
            return firstNum + diff * p
        },
        swing: function (p, n, firstNum, diff) {
            return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum
        }
    },
    tick: function () {
        var timers = this.timers;
        for (var i = 0; i < timers.length; i++) {
            if (!timers[i]()) {
                timers.splice(i--, 1)
            }
        }
        if (!timers.length) {
            this.stop()
        }
    },
    stop: function () {
        clearInterval(this.timerId);
        this.timerId = null;
        this.callback(this)
    },
    move: function (fx) {
        if (fx.elem.style && fx.elem.style[fx.prop] != null) {
            fx.elem.style[fx.prop] = (fx.prop === "top" || fx.prop === "width" || fx.prop === "height" ? Math.max(0,
                fx.now) : fx.now) + fx.unit
        } else {
            fx.elem[fx.prop] = fx.now
        }
    },
    update: function () {
        this.move(this)
    },
    custom: function (from, to, unit) {
        this.startTime = (new Date).getTime();
        this.start = from;
        this.end = to;
        this.unit = unit || this.unit || "px";
        this.now = this.start;
        this.pos = this.state = 0;
        var self = this;

        function t(gotoEnd) {
            return self.step(gotoEnd)
        }
        t.elem = this.elem;
        if (t() && this.timers.push(t) && !this.timerId) {
            this.timerId = setInterval(function () {
                return self.tick.apply(self, [])
            }, 13)
        }
    },
    step: function (gotoEnd) {
        var t = (new Date).getTime(),
            done = true;
        if (gotoEnd || t >= this.options.duration + this.startTime) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();
            return false
        } else {
            var n = t - this.startTime;
            this.state = n / this.options.duration;
            this.pos = this.easing.swing(this.state, n, 0, 1, this.options.duration);
            this.now = this.start + ((this.end - this.start) * this.pos);
            this.update()
        }
        return true
    }
};
window.Auto = Auto

AutoClubBigPic.prototype = {
    constructor: AutoClubBigPic,
    init : function(){
        var that = this;
        setTimeout(function(){
            window.scrollTo(0, 1);
        },0);
 
        that.getHtml();
    },
    //获取内容
    getHtml : function(){
        var that = this,
            htmls = bigPicsTemplate.mainTemplate(that.getWinWidth()-20, that.getWinHeight());
        
        //隐藏小图片
        $(that.options.hideEle.first).hide();

        //显示大图片容器
        $(that.options.containEle).html(htmls).show();

        //获取图片
        that.loadPic();
        document.body.style.background = '#000';
    },
    //获取图片
    loadPic : function(){
        var that = this;
        //设置容器的高度
        $(that.eleConfigs.focusEle).css('height',that.getWinHeight()+'px');
        //显示loading
        //$(that.options.loadingEle).show();

        //读取图片
        that.initPic();
        //添加事件
        that.InitEvent();
    },
    //读取图片
    initPic : function(){
        var that = this;
        that.imgList = $(that.eleConfigs.singleImgEles);
        that.cacheHtml['firstEle'] = bigPicsTemplate.templatePic('first', that.getWinWidth()-20, that.getWinHeight());
        that.cacheHtml['secondEle'] = bigPicsTemplate.templatePic('second', that.getWinWidth()-20, that.getWinHeight());
        that.cacheHtml['threeEle'] = bigPicsTemplate.templatePic('three', that.getWinWidth()-20, that.getWinHeight());

        this.InitSwipe();
    },
    InitSwipe : function(){
        var that = this,
            item = $(that.eleConfigs.itemsEle),
            iLeft = that.getWinWidth();

        //设置标题    
        that.setTitle();
        //获取当前索引
        that.getIndex(that.options.imgSrc);
        //设置容器位置
        item.css('left',-iLeft+'px');
        //设置页数
        that.changeNum();
        //设置图片
        that.setImg(that.currentIndex, true);
    },  
    //设置标题
    setTitle : function(){
        var that = this,
            title = this.options.title || '';
        $(that.eleConfigs.titleEle).html(title);
    },
    //获取当前索引
    getIndex : function(url){
        var that = this,
            data = {};

        if(!url){
            return 0;
        }   

        //接收到的数据
        var data = that.options.data;

        //筛选图片
        that.each(data,url);
    },
    //筛选图片
    each : function(data,url){
        if(!data || !url){
            return;
        }

        var that = this;

        if(data.length > 0){
            for(var i=0; i<data.length; i++){
                var pic = data[i].bigPic;

                pic = pic.substring(pic.lastIndexOf('/'));
                url = url.substring(url.lastIndexOf('/'));

                //判断当前图片的索引
                if(pic == url){
                    that.currentIndex = i;
                    break;
                }
            }
        }
    },
    //设置图片
    setImg : function(current,switchs){
        var that = this,
            prevNum = '',
            currentNum = '',
            nextNum = '',
            firstEle = that.eleConfigs.firstEle,
            secondEle = that.eleConfigs.secondEle,
            threeEle = that.eleConfigs.threeEle,
            firstConEle = that.eleConfigs.firstConEle,
            secondConEle = that.eleConfigs.secondConEle,
            threeConEle = that.eleConfigs.threeConEle,
            data = that.options.data,
            len = that.options.data.length;

        //假如当前图片等于第一张
        if(current == 0){
            //当前图片
            currentNum = data[current];
            //下一张图片
            nextNum = data[current+1];
            $(firstConEle).html('');
            $(secondEle).attr('src',currentNum.bigPic);

            if(!switchs){
                $(threeConEle).html(that.cacheHtml['threeEle']);
                $(that.eleConfigs.threeEle).attr("src", nextNum.bigPic);
            }
            else{
                $(threeEle).attr('src',nextNum.bigPic);
            }

            $(that.eleConfigs.itemsEle).css('left',-that.getWinWidth()+'px');
            return;
        }

        $(firstConEle).html(that.cacheHtml["firstEle"]);
        $(threeConEle).html(that.cacheHtml["threeEle"]);

        //假如当前图片等于最后一张
        if(current == len-1){
            //上一张图片
            prevNum = data[current-1];
            //当前图片
            currentNum = data[current];

            if(switchs){
                $(firstEle).attr("src", prevNum.bigPic);
                $(secondEle).attr("src", currentNum.bigPic);
            }
            else{
                //$(secondConEle).html(that.cacheHtml["secondEle"]);
                $(firstEle).attr('src',prevNum.bigPic);
                $(that.eleConfigs.secondEle).attr("src", currentNum.bigPic);
            }

            $(threeConEle).html('');
            $(that.eleConfigs.itemsEle).css("left", -that.getWinWidth() + "px");
            return;
        }

        //当前图片
        currentNum = data[current];
        //上一张图片
        prevNum = data[current-1];
        //下一张图片
        nextNum = data[current+1];

   
        $(firstEle).attr("src", prevNum.bigPic);
        $(secondEle).attr("src", currentNum.bigPic);
        $(threeEle).attr("src", nextNum.bigPic);

        $(that.eleConfigs.itemsEle).css("left", -that.getWinWidth() + "px");
  
        $(firstEle).css("-webkit-transform", "");
        $(secondEle).css("-webkit-transform", "");
        $(threeEle).css("-webkit-transform", "");
    },
    //设置页数和按钮
    changeNum : function(){
        var that = this;
        that.setBottom(that.currentIndex+1, that.options.data.length);
    },
    setBottom : function(currentPage,totalPage){
        var that = this,
            prevBtn = $(that.eleConfigs.prevBtn),
            nextBtn = $(that.eleConfigs.nextBtn),
            bottomPage = $(that.eleConfigs.bottomPage),
            title = $(that.eleConfigs.titleEle),
            download = $(that.eleConfigs.downloadEle);

        if(!currentPage || !totalPage){
            prevBtn.hide();
            nextBtn.hide();
            download.hide();
            bottomPage.html('');
            title.html('');
        }
        else{
            prevBtn.show();
            nextBtn.show();
            download.show();

            title.html(this.options.title);
            bottomPage.html("<b>" + currentPage + "</b>/" + totalPage);
        }
    },
    //添加事件
    InitEvent : function(){
        var that = this;

        //关闭
        $(that.eleConfigs.closeEle).on('click',function(){
            $(that.options.hideEle.first).css("display", "");
            $(that.options.containEle).hide();

            document.body.style.background = '';

            this.oBtn = false;
            //滚动条位置
            window.scrollTo(0, that.options.scrollTop);
        });

        //收藏
        $(that.eleConfigs.collection).on('click',function(){  
            var url = $(that.eleConfigs.secondEle).attr('src');

            if(url){
                that.url = url;
            }

           $(this).addClass('active');
        });

        //返回收藏图片
        $(that.eleConfigs.back).on('click',function(){ 
            var item = $(that.eleConfigs.itemsEle),
                iLeft = that.getWinWidth();

            if(that.url == '') return;

            //获取当前索引
            that.getIndex(that.url);
            //设置容器位置
            item.css('left',-iLeft+'px');
            //设置页数
            that.changeNum();
            //设置图片
            that.setImg(that.currentIndex, true);

            $(that.eleConfigs.collection).removeClass('active');
            that.url = '';
        });

        //上一张图片
        $(that.eleConfigs.prevBtn).on("click",function () { 
            that.Prev();
        });

        //下一张图片
        $(that.eleConfigs.nextBtn).on("click",function () { 
            that.Next();
        });

        //手机事件绑定
        touchStartHandler = $.proxy(that.touchStart,that);
        touchMoveHandler = $.proxy(that.touchMove,that);
        touchEndHandler = $.proxy(that.touchEnd,that);

        var itemsEle = $(that.eleConfigs.itemsEle);

        itemsEle.on('touchstart', touchStartHandler);
        itemsEle.on('touchmove', touchMoveHandler);
        itemsEle.on('touchend', touchEndHandler);

        //事件绑定
        itemsEle.on('mousedown',$.proxy(that.touchStart,that));
        itemsEle.on('mousemove',$.proxy(that.touchMove,that));
        itemsEle.on('mouseout',$.proxy(that.touchEnd,that));

        itemsEle.on('gesturestart',$.proxy(that.gesturestart,that));
        itemsEle.on('gesturechange',$.proxy(that.gesturechange,that));
        itemsEle.on('gestureend',$.proxy(that.gestureend,that));
    },
    //上一张图片
    Prev : function(){
        var that = this;
        if(this.currentIndex == 0){
            return;
        }

        that.currentIndex--;
        that.changeNum();
        that.moveTo(false);
    },
    //下一张图片
    Next : function(){
        var that = this,
            currentIndex = that.currentIndex,
            len = that.options.data.length-1;

        that.currentIndex++;

        if(that.currentIndex > len){
            that.currentIndex = len;
            return;
        }

        that.changeNum();
        that.moveTo(true);
    },
    moveTo : function(btn){
        var that = this,
            distance = 0;;

        if(btn){
          distance = -that.getWinWidth() * 2;
        }
        else{
          distance = 0;  
        }

        new Auto["animate1"]({
            elem: eleContainer = $(that.eleConfigs.itemsEle)[0],
            left: distance
        }, 300, function () {
            that.setImg(that.currentIndex, btn);
        })
    },
    touchStart : function(ev){
        var that = this;

        if(ev.targetTouches){
            that.touchObj["isTouch"] = true;
            that.startPoint.x = ev.targetTouches[0].clientX;
            that.startPoint.y = ev.targetTouches[0].clientY;
        }
        else{
            that.startPoint.x = ev.clientX;
            that.startPoint.y = ev.clientY;
        }

        that.touchObj["isMove"] = true;
    },
    touchMove : function(ev){
       var that = this;

        ev.preventDefault();
        if (!that.touchObj["isMove"]) { return; }
        var tempX, tempY, x = 0, y = 0, /* 触摸需要移动坐标 */
            dx = 0, dy = 0, horizontal = undefined;/* 每次移动距离 */
        if (that.touchObj["isTouch"]) {
            tempX = ev.targetTouches[0].clientX;
            tempY = ev.targetTouches[0].clientY;
        } else {
            tempX = ev.clientX;
            tempY = ev.clientY;
        }
        dx = tempX - that.startPoint.x;
        dy = tempY - that.startPoint.y;

        that.startPoint.x = tempX;
        that.startPoint.y = tempY;
        x = parseFloat($(that.eleConfigs.itemsEle).css("left"));
        x += dx;
        y += dy;

        that.touchObj["dx"] = dx;
        if (horizontal == undefined) {
            if (Math.abs(dx) > Math.abs(dy)) {
                horizontal = true;
            } else {
                horizontal = false;
            }
        }
        if (horizontal) {
            ev.preventDefault();
            $(that.eleConfigs.itemsEle).css("left", x);
        } else {
            horizontal = undefined;
            return;
        }

    },
    touchEnd : function(ev){
 
        var that = this;

        that.touchObj["isMove"] = false;

        ev.preventDefault();
        var iWidth = -that.getWinWidth(),
            len = this.options.data.length;

        //切换下一张
        if(that.touchObj["dx"] < 0){
            that.currentIndex++;

            if(that.currentIndex >= len){
                that.currentIndex = len-1;

                new Auto["animate1"]({
                    elem: eleContainer = $(that.eleConfigs.itemsEle)[0],
                    left: -that.getWinWidth()
                }, 500, function () {
                    that.setImg(that.currentIndex, false)
                })
            }
            else{
                that.changeNum();
                that.moveTo(true)
            }
            
        }
        else if(that.touchObj["dx"] > 0){
            that.currentIndex--;

            if (that.currentIndex < 0) {
                that.currentIndex = 0;
                new Auto["animate1"]({
                    elem: eleContainer = $(that.eleConfigs.itemsEle)[0],
                    left: -that.getWinWidth()
                }, 500, function () {
                    that.setImg(that.currentIndex, false)
                })
            } else {
                that.changeNum();
                that.moveTo(false)
            }
        }
        else{
            $(that.eleConfigs.itemsEle).css("left", iWidth);
        }

        that.touchObj["dx"] = 0
    },
    //手指有触发屏幕
    gesturestart : function(ev){
        var that = this;

        ev.preventDefault();

        if(ev.target.tagName.toLocaleLowerCase() != 'img'){
            return;
        }

        that.removeTransform(ev);

        if(that.oBtn == false){
            that.oBtn = true;
            var itemsEle = $(that.eleConfigs.itemsEle);

            //解绑所有事件
            itemsEle.off('touchstart', touchStartHandler);
            itemsEle.off('touchmove', touchMoveHandler);
            itemsEle.off('touchend', touchEndHandler);

            //图片放大后触发事件
            touchGestureStartHandler = $.proxy(that.touchGestureStart,that);
            touchGestureMoveHandler = $.proxy(that.touchGestureMove,that);
            touchGestureEndHandler = $.proxy(that.touchGestureEnd,that);

            itemsEle.on('touchstart', touchGestureStartHandler);
            itemsEle.on('touchmove', touchGestureMoveHandler);
            itemsEle.on('touchend', touchGestureEndHandler);
        }
    },
    touchGestureStart : function(ev){
        var that = this;

        if (ev.target.tagName.toLocaleLowerCase() != "img") {
            return;
        }

        ev.preventDefault();

        if (ev.targetTouches) {
            if (ev.targetTouches.length > 1) {
                return
            }

            that.touchGestureObj["isTouch"] = true;
            that.startPoint.x = ev.targetTouches[0].clientX;
            that.startPoint.y = ev.targetTouches[0].clientY;

        }
        that.touchGestureObj["isMove"] = true
    },
    touchGestureMove : function(ev){
        var that = this;

        ev.preventDefault();
        if (ev.targetTouches) {
            if (ev.targetTouches.length > 1) {
                return
            }
        }
        if (ev.target.tagName.toLocaleLowerCase() != "img") {
            return
        }
        if (!that.touchGestureObj["isMove"]) {
            return
        }

        var clientX = 0,
            clientY = 0,
            endX = 0,
            endY = 0;

        if (that.touchGestureObj["isTouch"]) {
            clientX = ev.targetTouches[0].clientX;
            clientY = ev.targetTouches[0].clientY;
        }

        endX = lastShiftPointX + (clientX - that.startPoint.x) / gestureScale;
        endY = lastShiftPointY + (clientY - that.startPoint.y) / gestureScale;

        var translate3DValue = "translate3d(" + endX + "px, " + endY + "px, 0) scale(" + gestureScale + ")";
        $(ev.target).css("-webkit-transform", translate3DValue);

        shiftPointX = endX;
        shiftPointY = endY;
    },
    touchGestureEnd : function(ev){
        var that = this;

        ev.preventDefault();
        that.touchObj["isMove"] = false;

        if (ev.target.tagName.toLocaleLowerCase() != "img") {
            return;
        }

        if (shiftPointX > 300) { shiftPointX = 300; }
        if (shiftPointX < -300) shiftPointX = -300;
        if (shiftPointY > 200) shiftPointY = 200;
        if (shiftPointY < -200) shiftPointY = -200;

        lastShiftPointX = shiftPointX;
        lastShiftPointY = shiftPointY;
    },  
    //当触摸屏幕的任何一个手指发生变化
    gesturechange : function(ev){ 
         var ev = ev || window.event;     
         ev.preventDefault();

         if (ev.target.tagName.toLocaleLowerCase() != "img") {
            return;
        }

        //两个手指之间的距离变化
        if (ev.scale <= 0.9 || ev.scale >= 3) {
            return;
        }

        //让图片放大缩小
        $(ev.target).css("-webkit-transform", "scale(" + ev.scale + ")");

        gestureScale = ev.scale;
    },
    gestureend : function(ev){
        var that = this;
        ev.preventDefault();

        if(ev.target.tagName.toLocaleLowerCase() != 'img'){
            return;
        }

        if(ev.scale <= 1){
            if(that.oBtn){
                that.oBtn = false;

                var itemsEle = $(that.eleConfigs.itemsEle);

                itemsEle.on('touchstart', touchStartHandler);
                itemsEle.on('touchmove', touchMoveHandler);
                itemsEle.on('touchend', touchEndHandler);

                itemsEle.off('touchstart', touchGestureStartHandler);
                itemsEle.off('touchmove', touchGestureMoveHandler);
                itemsEle.off('touchend', touchGestureEndHandler);

                that.removeWebkitTransformStyle(ev);

                lastShiftPointX = 0;
                lastShiftPointY = 0;
                shiftPointX = 0;
                shiftPointY = 0;
            }
        }

    },
    //去除transform
    removeTransform : function(e){
        $(e.target).css("-webkit-transform", "")
    },
    //获取浏览器宽度
    getWinWidth : function(){
        return $(document).width();
    },
    //获取浏览器高度
    getWinHeight : function(){
        return $(document).height();
    }
};


