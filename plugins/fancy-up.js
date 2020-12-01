var app = {
    version: '애플파이 3.5',
    int_version : 8,
    license_key : 'change_cache_id',
    name : '',
    debug: true,
    language : '',
    lang : {},
    cache:false,
    cache_time:15000,
    host_url: 'http://thebalance.fancyupsoft.com',
    service_root_dir : '',
    server_language: '.php',
    templateSettings: null,
    // {
    //     evaluate: /\{\{(.+?)\}\}/g,
    //     interpolate: /\{\{=(.+?)\}\}/g,
    //     escape: /\{\{-(.+?)\}\}/g
    // },
    docs: {
    },
    template: [],
    assets : '../doughnut',
    src : 'http://thebalance.fancyupsoft.com/src',
    res : '../res',
    layout: {},
    layout_panel: {
        left : {
            id:'#left',
            target:null,
            toggle:null
        },
        right : {
            id:'#right',
            target:'#right',
            toggle:'transitioned'
        },
        rightside: {
            id:'#rightside',
            target:'#rightside',
            toggle:'rightside_transitioned'
        },
        rightthird: {
            id:'#rightthird',
            target:'#rightthird',
            toggle:'rightthird_transitioned'
        },
        bottom: {
            id:'#bottom',
            target:'#bottom',
            toggle:'bottom_transitioned'
        },
        bottomside: {
            id:'#bottomside',
            target:'#bottomside',
            toggle:'bottomside_transitioned'
        },
        modal: {
            id:'#myModal',
            target:'#myModal',
            toggle:null
        }
    },

    // time
    location_delay_time: 0,

    initialize: function(plugins) {
        var self = this;
        self.docs = plugins;
    },
    log: function(msg) {
        if (app.debug) {
            if (_.isObject(msg)) {
                console.log(JSON.stringify(msg));
            } else {
                console.log(msg);
            }
        }
    },
    go_url: function(url) {
        window.setTimeout(function() {
            window.location.href = url;
        }, this.location_delay_time);
    },
    // return json data
    parserResource : function(filename, callback){
        var self = this;
        var _callback = (!_.isUndefined(callback) && _.isFunction(callback)) ? callback : null;

        // lang
        var _filename = app.res + filename;
        if(self.language !=''){
            _filename = app.res + filename+'_'+self.language;
        }
        $.getJSON(_filename+'.json')
        .done(function(data, textStatus, jqXHR) {
            _callback(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            app.log(textStatus);
        });
    }
};

window.Runnable = (function (callback, delay) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
        window.setTimeout(callback, delay);
    };
})();

var Handler = {
    post : function (callback, delay){
        setTimeout(function(){
            Runnable(callback,0);
        }, delay);
    }
};

// 모바일체크
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// TextUtil
var TextUtil = {
    version : 1,
    // 01011112222 -> 010-1111-2222
    phone_format: function(num) {
        num = num.replace(/[^0-9]/g, '');
        var result = '';
        if (num.length < 4) {
            return num;
        } else if (num.length < 7) {
            result += num.substr(0, 3);
            result += '-';
            result += num.substr(3);
            return result;
        } else if (num.length < 11) {
            result += num.substr(0, 3);
            result += '-';
            result += num.substr(3, 3);
            result += '-';
            result += num.substr(6);
            return result;
        } else {
            result += num.substr(0, 3);
            result += '-';
            result += num.substr(3, 4);
            result += '-';
            result += num.substr(7);
            return result;
        }
        return num;
    },

    // 8000 -> 8 KB
    file_format_bytes: function(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    // youtube url 주소에서 id 추출
    get_youtube_id :function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return '';
        }
    },

    // 랜덤
    randomNumber : function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    // [{id:1},{id:2},{id:3}] 배열중에서 id: 1번 찾기
    find_index : function(argv, search_key, search_value){
        var _index = -1;
        var is_data = (_.isArray(argv) && argv.length>0) ? true : false;
        if( !is_data){
            return _index;
        }
    
        for(var i=0; i<argv.length; i++){
            var chkid=argv[i][search_key];
            if(!_.isUndefined(chkid) && chkid == search_value){
                _index = i;
                break;
            }
        }
    return _index;
    }
};

// UrlUtil
var UrlUtil = {
    version : 3,
    current_id : null,
    _url_params : {},
    // init object {}
    initialize : function(params){
        this._url_params = params;
    },
    doEmpty : function(){
        this._url_params = {};
    },
    // object {k:v}
    pushUrlParams : function(params){
        _.extend(this._url_params, params);
    },
    // array [a,b]
    removeParams : function(argv){
        var self = this;
        self._url_params = _.omit(self._url_params, argv);
    },
    getURLVariablesByName: function(name) {
        var result = '';
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        var count = sURLVariables.length;
        for (var i = 0; i < count; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == name) {
                result = sParameterName[1];
                break;
            }
        }
        return result;
    },
    // a=1&b=2 -> {a:1, b:2}
    getURL2JSON: function() {
        var result = {};
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        var count = sURLVariables.length;
        for (var i = 0; i < count; i++) {
            var sParameterName = sURLVariables[i].split('=');
            var k = sParameterName[0];
            var v = sParameterName[1];
            result[k] = v;
        }
        return result;
    },
    // history change url
    pushState:function(id, title, url){
        var self = this;
        self.current_id = id;
        window.history.pushState(id, title, url);
    },
    replaceStage : function(id, title, url){
         window.history.replaceState(id, title, url);
    }
};

// panel
var Panel = {
    version : 2,
    // return : {} || null
    onStart : function(panel_setting){
        // panel
        var panel = null;
        if (!_.isNull(panel_setting.panel)) {
            var this_panel = panel_setting.panel;
            panel = app.layout_panel[this_panel];
            if (!_.isNull(panel.target))
            {
                if (!$(panel.id).hasClass(panel.toggle)) {
                    // title
                    if(!_.isUndefined(panel_setting.title) && !_.isNull(panel_setting.title)){
                        $(panel.id+'_title').text(panel_setting.title);
                    }

                    Handler.post(function(){
                        // toggle
                        if(panel_setting.panel == 'modal'){
                            $(panel.id).modal('show');
                        }else{
                            $(panel.target).toggleClass(panel.toggle);
                        }
                    },10);                    
                }
            }
        }
    return panel;
    },
    onStop : function(panel_id){
        panel_id = (panel_id) ? panel_id.replace('#','') : '';

        switch(panel_id){
            case 'modal':
                if ($('#myModal').hasClass('show')) {
                    $('#myModal').modal('hide');
                }
            break;
            case 'bottomside':
                if ($('#bottomside').hasClass("bottomside_transitioned")) {
                    $('#bottomside_docs_contents').html('');
                    $("#bottomside").toggleClass('bottomside_transitioned');
                }
            case 'bottom':
                if ($('#bottom').hasClass("bottom_transitioned")) {
                    $('#bottom_docs_contents').html('');
                    $("#bottom").toggleClass('bottom_transitioned');
                }
            break;
            case 'rightthird' :
                if ($('#rightthird').hasClass("rightthird_transitioned")) {
                    $('#rightthird_docs_contents').html('');
                    $("#rightthird").toggleClass('rightthird_transitioned');
                }
            break;
            case 'rightside' :
                if ($('#rightside').hasClass("rightside_transitioned")) {
                    $('#rightside_docs_contents').html('');
                    $("#rightside").toggleClass('rightside_transitioned');
                }
            break;
            case 'right':
                if ($('#right').hasClass("transitioned")) {
                    $('#right_docs_contents').html('');
                    $("#right").toggleClass('transitioned');
                }
            break;
        }
    }
};

var Toast = {
    version : 1,
    show : function(title,msg,time,option){
        var self = this;

        var _option = {
            position : (!_.isUndefined(option) && !_.isUndefined(option.position)) ? option.position : 'right',
            style : (!_.isUndefined(option) && !_.isUndefined(option.style)) ? option.style : 'warning',
        };

        var toast_id=(new Date()).getTime();
        DocAsyncTask.doGetContents({
            "panel"     : null,
            "title"     : null,
            "frame"     : null,
            "template"  : app.assets+"/toast/toast#template_toast",
            "value"     : {result:'true',id:toast_id,title:title,msg:msg,style:_option.style,position:_option.position}
        }, {},{
            success: function(tpl, resp) {
                $('body').append(tpl).promise().done(function(){
                    self.close(toast_id,time);
                });
            }
        });
    },
    close : function(toast_id,t){
        window.setTimeout(function(){
            $('#toast'+toast_id).animateCss('fadeOutUp',function(){
                $('#toast'+toast_id).removeClass('show');
                $('#toast'+toast_id).remove();
            });            
        }, t);
    }
};

// requirejs config
require.config({
    baseUrl: '../plugins',
    waitSeconds : 5,
    urlArgs : "v=" + ((app.debug) ? (new Date()).getTime() : app.int_version),
    paths: {
        'text': 'libs/js/plugin/text-2.0.14.min',
        'jquery': 'libs/js/jquery-2.1.4.min',
        'underscore': 'libs/js/underscore-1.8.3.min',
        'underscore.string': 'libs/js/underscore.string.min',
        'backbone': 'libs/js/backbone-1.2.2.min',
        'backbone-fetch-cache':'libs/js/plugin/backbone.fetch-cache.min',
        'finger': 'libs/js/plugin/jquery.finger.min',
        'crypto-js': 'libs/js/crypto-js/crypto-js',
        'lazyload': 'libs/js/plugin/lazyload-1.9.7.min',
        'Tether': 'libs/js/plugin/tether.min',
        'bootstrap': 'libs/js/plugin/bootstrap.min',
        'jqueryform': 'libs/js/plugin/jquery.form.min',
        // 'history': 'libs/js/plugin/jquery.history.min',
        'select2': 'libs/js/plugin/select2.min',
        // 'scrollcap': 'libs/js/plugin/scroll.jehovahs',
        'imagesLoaded':'libs/js/plugin/imagesloaded.pkgd.min',
        'swiper': 'libs/js/plugin/swiper.min',
        'touchSwipe': 'libs/js/plugin/jquery.touchSwipe.min',
        'refresh': 'libs/js/plugin/material-refresh.min',
        'DateFormat': 'libs/js/plugin/jquery-dateFormat.min',
        'rolldate': 'libs/js/plugin/rolldate.min',
        'ripple': 'libs/js/plugin/jquery-ripple.min',
        'Masonry': 'libs/js/plugin/masonry.pkgd.min',
        'nouislider': 'libs/js/plugin/nouislider.min',
        'wNumb': 'libs/js/plugin/wNumb.min',
        'prism': 'libs/js/plugin/prism.min',
        'ProgressBar': 'libs/js/plugin/progress.min',
        'd3': 'libs/js/plugin/d3-4.13.0.min',
        'd3Donut3D': 'libs/js/plugin/d3.v3.donut3D',
        'c3': 'libs/js/plugin/c3.min',
        'chartjs': 'libs/js/plugin/chartjs/dist/Chart.min',
        'moment': 'libs/js/plugin/moment.min',
        'TweenMax':  "libs/js/plugin/greensockjs/TweenMax.min",
        'TweenLite': "libs/js/plugin/greensockjs/TweenLite.min",
        'CSSPlugin': "libs/js/plugin/greensockjs/plugins/CSSPlugin.min",
        'TimelineLite': "libs/js/plugin/greensockjs/TimelineLite.min",
        'TimelineMax': "libs/js/plugin/greensockjs/TimelineMax.min",
        'EasePack': "libs/js/plugin/greensockjs/easing/EasePack.min",
        'greensock': 'libs/js/plugin/greensockjs',
        'ScrollMagic': 'libs/js/plugin/ScrollMagic.min',
        'scrollmagic': 'libs/js/plugin/scrollmagic',
    // 'marquee': 'libs/js/plugin/jquery.marquee.min',
        'Activity': 'core/activity.min',
        'DocAsyncTask': 'core/docasynctask.min',
        'DrawerNavigation': 'core/drawer_menu.min',
        'summernote': 'summernote',
        'ckeditor-core': 'ckeditor/ckeditor',
        'ckeditor' : 'ckeditor/adapters/jquery',
        'uploadfiles': 'uploadfiles',
        'datepicker': 'datepicker',
        'clockpicker': 'libs/js/plugin/clockpicker.min',
        'document': 'document',
        'core': 'core',
        'assets':'..',
        'parent': '..'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: function() {
                return '_';
            }
        },
        // 'underscore.string': {
        //     deps: ['underscore']
        // },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'finger': {
            deps: ['jquery'],
            exports: 'finger'
        },
        
        // 'select2': {
        //     deps: ['jquery'],
        //     exports: 'select2'
        // },
        'jqueryform': {
            deps: ['jquery'],
            exports: 'jqueryform'
        },
        'summernote': {
            deps: ['jquery', 'bootstrap'],
            exports: 'summernote'
        },
        'ckeditor': {
            deps:['jquery','ckeditor-core'],
            exports: 'ckeditor'
        },
        'lazyload': {
            deps: ['jquery'],
            exports: 'lazyload'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'slider' : {
            deps: ['jquery', 'bootstrap'],
            exports: 'slider'
        },
        'text': {
            deps: [],
            exports: 'text'
        },
        'json': {
            deps: ['text'],
            exports: 'json'
        },
        'refresh': {
            deps: ['jquery'],
            exports: 'mRefresh'
        },
        'd3': {
            deps: [],
            exports: 'd3'
        },
        'd3Donut3D': {
            deps: [],
            exports: 'Donut3D'
        },
        'c3': {
            deps: ['d3'],
            exports: 'c3'
        },
        'chartjs': {
            deps: ['moment']    // enforce moment to be loaded before chartjs
        },
        'TweenMax': {
            deps: [],
            exports: 'TweenMax'
        },
        'TweenLite': {
            deps: [],
            exports: 'TweenLite'
        },
        'TimelineLite': {
            deps: [],
            exports: 'TimelineLite'
        },
        'TimelineMax': {
            deps: [],
            exports: 'TimelineMax'
        },
        'CSSPlugin': {
            deps: [],
            exports: 'CSSPlugin'
        },
        'EasePack': {
            deps: [],
            exports: 'EasePack'
        },
        'clockpicker': {
            deps: ['jquery', 'bootstrap'],
            exports: 'clockpicker'
        },
        'ScrollMagic': {
            deps: [],
            exports: 'ScrollMagic'
        },
        'DateFormat': {
            deps: ['jquery'],
            exports: 'DateFormat'
        },
        'ripple': {
            deps: ['jquery'],
            exports: 'ripple'
        },
        'nouislider': {
            deps: [],
            exports: 'noUiSlider'
        },
        'wNumb': {
            deps: [],
            exports: 'wNumb'
        },
        'history': {
            deps: ['jquery'],
            exports: 'history'
        },
        'Masonry': {
            deps: ['jquery'],
            exports: 'Masonry'
        },
        // 'scrollcap': {
        //     deps: ['jquery'],
        //     exports: 'scrollcap'
        // },
        'prism': {
            deps: ['jquery'],
            exports: 'Prism'
        },
        'ProgressBar': {
            deps: [],
            exports: 'ProgressBar'
        },
        'swiper': {
            deps: ['jquery'],
            exports: 'swiper'
        },
        'datepicker/picker.date': ['datepicker/picker'],
        'datepicker/translations/ko_KR': ['datepicker/picker.date'],
        'uploadfiles/jquery.uploadfile.min': ['jqueryform']
    },

    map: {
        '*': {
            'css': 'libs/js/plugin/require-css.min'
        }
    }
});

// run
require(['jquery','underscore','backbone','bootstrap','ProgressBar','DocAsyncTask','Activity','DrawerNavigation','css!libs/css/animate.min.css'],
    function($, _, Backbone, bootstrap, ProgressBar, DocAsyncTask, Activity, DrawerNavigation) {
        // _.mixin(_string.exports());

        $(document).ready(function() {
            var jQuery = $;
            console.log('fancy-up');
            console.log('app version : ' + app.version);
            console.log('app version int : ' + app.int_version);
            console.log('app console debug mode : ' + app.debug);
            console.log('app license_key : ' + app.license_key);
            app.log($().jquery);

            // set underscore template tag setting
            if (!_.isNull(app.templateSettings)) {
                _.templateSettings = app.templateSettings;
                app.log('changed template settings to use different symbols to set off interpolated code');
            }

            // css animate
            $.fn.extend({
                animateCss: function(animationName, callback) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    this.addClass('animated ' + animationName).one(animationEnd, function() {
                        $(this).removeClass('animated ' + animationName);
                        // callback
                        if(!_.isNull(callback) && _.isFunction(callback)){
                            callback(animationName);
                        }
                    });
                }
            });

            // callback
            onReady(jQuery, _, Backbone, bootstrap);
        });
    });
