const app = {
    version: 'flexvue',
    int_version : 8,
    license_key : 'change_cache_id',
    name : '',
    debug: true,
    language : '',
    lang : {},
    cache:false,
    cache_time:15000,
    host_url: 'http://kfield.co.kr/',
    service_root_dir : '',
    server_language: '.php',
    docs: {
    },
    template: [],
    assets : '../v1',
    src : 'http://kfield.co.kr/src',
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
        bottomthird: {
            id:'#bottomthird',
            target:'#bottomthird',
            toggle:'bottomthird_transitioned'
        },
    },

    // time
    location_delay_time: 0,

    initialize (plugins) {
        const self = this;
        self.docs = plugins;
    },
    log (msg) {
        if (app.debug) {
            console.log(msg);
        }
    },
    go_url (url) {
        window.setTimeout(()=> {
            window.location.href = url;
        }, this.location_delay_time);
    },
    // return json data
    parserResource  (filename, callback){
        const self = this;
        let _callback = ((typeof callback !== 'undefined') && (typeof callback ==='function')) ? callback : null;

        // lang
        let _filename = app.res + filename;
        if(self.language !=''){
            _filename = app.res + filename+'_'+self.language;
        }
        // $.getJSON(_filename+'.json')
        // .done(function(data, textStatus, jqXHR) {
        //     _callback(data);
        // })
        // .fail(function(jqXHR, textStatus, errorThrown) {
        //     app.log(textStatus);
        // });
        let data = require(_filename+'.json');
        _callback(data);
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

const Handler = {
    post (callback, delay){
        setTimeout(()=>{
            Runnable(callback,0);
        }, delay);
    }
};

const template = function(tpl, data){
    const func = new Function(...Object.keys(data),  "return `"+tpl +"`;");
    return func(...Object.values(data));
}

// 모바일체크
const isMobile = {
    Android() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// TextUtil
const TextUtil = {
    version : 1,
    // 01011112222 -> 010-1111-2222
    phone_format(num) {
        num = num.replace(/[^0-9]/g, '');
        let result = '';
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
    file_format_bytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        let k = 1000;
        let dm = decimals + 1 || 3;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    // youtube url 주소에서 id 추출
    get_youtube_id(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return '';
        }
    },

    // 랜덤
    randomNumber(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    // [{id:1},{id:2},{id:3}] 배열중에서 id: 1번 찾기
    find_index(argv, search_key, search_value){
        var _index = -1;
        let is_data = (_.isArray(argv) && argv.length>0) ? true : false;
        if( !is_data){
            return _index;
        }
    
        for(let i=0; i<argv.length; i++){
            let chkid=argv[i][search_key];
            if((typeof chkid !=='undefined') && (chkid == search_value)){
                _index = i;
                break;
            }
        }
    return _index;
    }
};

// UrlUtil
const UrlUtil = {
    version : 3,
    current_id : null,
    _url_params : {},
    // init object {}
    initialize (params){
        this._url_params = params;
    },
    doEmpty (){
        this._url_params = {};
    },
    // object {k:v}
    pushUrlParams (params){
        this._url_params = Object.assign(this._url_params, params);
    },
    // array [a,b]
    removeParams (argv){
        const self = this;
        if(Array.isArray(argv)){
            argv.forEach(function(k){
                if(self._url_params.hasOwnProperty(k)){
                    delete self._url_params[k];
                }
            });
        }
    },
    getURLVariablesByName(name) {
        let result = '';
        let sPageURL = window.location.search.substring(1);
        let sURLVariables = sPageURL.split('&');
        let count = sURLVariables.length;
        for (let i = 0; i < count; i++) {
            let sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == name) {
                result = sParameterName[1];
                break;
            }
        }
        return result;
    },
    // a=1&b=2 -> {a:1, b:2}
    getURL2JSON() {
        let result = {};
        let sPageURL = window.location.search.substring(1);
        let sURLVariables = sPageURL.split('&');
        let count = sURLVariables.length;
        for (let i = 0; i < count; i++) {
            let sParameterName = sURLVariables[i].split('=');
            let k = sParameterName[0];
            let v = sParameterName[1];
            result[k] = v;
        }
        return result;
    },
    // history change url
    pushState(id, title, url){
        const self = this;
        self.current_id = id;
        window.history.pushState(id, title, url);
    },
    replaceStage(id, title, url){
         window.history.replaceState(id, title, url);
    }
};

// panel
const Panel = {
    version : 2,
    // return : {} || null
    onStart (panel_setting){
        // panel
        let panel = null;
        if (panel_setting.panel !== null) 
        {
            let this_panel = panel_setting.panel;
            panel = app.layout_panel[this_panel];
            if (panel.target !== null)
            {
                let classname = panel.toggle.replace('.','');
                if (!document.querySelector(panel.id).classList.contains(classname)) 
                {
                    // title
                    if((typeof panel_setting.title !=='undefined') && (panel_setting.title !== null)){
                        document.querySelector(`${panel.id}_title`).innerText = panel_setting.title;
                    }

                    Handler.post(()=>{
                        // toggle
                        document.querySelector(panel.target).classList.toggle(classname);
                    },10);
                }
            }
        }
    return panel;
    },

    onStop (panel_id){
        panel_id = (panel_id) ? panel_id.replace('#','') : '';

        switch(panel_id){
            case 'bottomthird':
                if (document.querySelector('#bottomthird').classList.contains('bottomthird_transitioned')) {
                    document.querySelector('#bottomthird_docs_contents').innerHTML ='';
                    document.querySelector("#bottomthird").classList.toggle('bottomthird_transitioned');
                }
            break;
            case 'bottomside':
                if (document.querySelector('#bottomside').classList.contains('bottomside_transitioned')) {
                    document.querySelector('#bottomside_docs_contents').innerHTML ='';
                    document.querySelector("#bottomside").classList.toggle('bottomside_transitioned');
                }
            case 'bottom':
                if (document.querySelector('#bottom').classList.contains('bottom_transitioned')) {
                    document.querySelector('#bottom_docs_contents').innerHTML ='';
                    document.querySelector("#bottom").classList.toggle('bottom_transitioned');
                }
            break;
            case 'rightthird' :
                if (document.querySelector('#rightthird').classList.contains('rightthird_transitioned')) {
                    document.querySelector('#rightthird_docs_contents').innerHTML ='';
                    document.querySelector("#rightthird").classList.toggle('rightthird_transitioned');
                }
            break;
            case 'rightside' :
                if (document.querySelector('#rightside').classList.contains('rightside_transitioned')) {
                    document.querySelector('#rightside_docs_contents').innerHTML ='';
                    document.querySelector("#rightside").classList.toggle('rightside_transitioned');
                }
            break;
            case 'right':
                if (document.querySelector('#right').classList.contains('right_transitioned')) {
                    document.querySelector('#right_docs_contents').innerHTML ='';
                    document.querySelector("#right").classList.toggle('right_transitioned');
                }
            break;
            case 'drawer_menu':
                if (document.querySelector('#drawer_menu').classList.contains('drawer_menu_transitioned')) {
                    document.querySelector("#drawer_menu").classList.toggle('drawer_menu_transitioned');
                }
            break;
            
        }
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
        'crypto-js': 'libs/js/crypto-js/crypto-js',
        'lazyload': 'libs/js/plugin/lazyload-1.9.7.min',
        'Tether': 'libs/js/plugin/tether.min',
        'imagesLoaded':'libs/js/plugin/imagesloaded.pkgd.min',
        'swiper': 'libs/js/plugin/swiper.min',
        'touchSwipe': 'libs/js/plugin/jquery.touchSwipe.min',
        'DateFormat': 'libs/js/plugin/jquery-dateFormat.min',
        'Masonry': 'libs/js/plugin/masonry.pkgd.min',
        'nouislider': 'libs/js/plugin/nouislider.min',
        'wNumb': 'libs/js/plugin/wNumb.min',
        'prism': 'libs/js/plugin/prism.min',
        'ProgressBar': 'libs/js/plugin/progress.min',
        'chartjs': 'libs/js/plugin/chartjs/dist/Chart.min',
        'moment': 'libs/js/plugin/moment.min',
        'flatpickr': 'flatpickr',
        'filepond': 'filepond',
        'TweenMax':  "libs/js/plugin/greensockjs/TweenMax.min",
        'TweenLite': "libs/js/plugin/greensockjs/TweenLite.min",
        'CSSPlugin': "libs/js/plugin/greensockjs/plugins/CSSPlugin.min",
        'TimelineLite': "libs/js/plugin/greensockjs/TimelineLite.min",
        'TimelineMax': "libs/js/plugin/greensockjs/TimelineMax.min",
        'EasePack': "libs/js/plugin/greensockjs/easing/EasePack.min",
        'greensock': 'libs/js/plugin/greensockjs',
        'Activity': 'core/activity.min',
        'DocAsyncTask': 'core/docasynctask',
        'DrawerNavigation': 'core/drawer_menu.min',
        'ckeditor-core': 'ckeditor/ckeditor',
        'ckeditor' : 'ckeditor/adapters/jquery',
        'document': 'document',
        'core': 'core',
        'assets':'..',
        'parent': '..'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'finger': {
            deps: ['jquery'],
            exports: 'finger'
        },
        'ckeditor': {
            deps:['jquery','ckeditor-core'],
            exports: 'ckeditor'
        },
        'lazyload': {
            deps: ['jquery'],
            exports: 'lazyload'
        },
        'flatpickr' :{
            deps: [],
            exports: 'flatpickr'
        },
        'filepond' :{
            deps: [],
            exports: 'FilePond'
        },
        'text': {
            deps: [],
            exports: 'text'
        },
        'json': {
            deps: ['text'],
            exports: 'json'
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
        'DateFormat': {
            deps: ['jquery'],
            exports: 'DateFormat'
        },
        'nouislider': {
            deps: [],
            exports: 'noUiSlider'
        },
        'wNumb': {
            deps: [],
            exports: 'wNumb'
        },
        'Masonry': {
            deps: ['jquery'],
            exports: 'Masonry'
        },
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
        }
    },

    map: {
        '*': {
            'css': 'libs/js/plugin/require-css.min'
        }
    }
});

// run
require(['jquery','ProgressBar','DocAsyncTask','Activity','css!libs/css/animate.min.css'],
    function($, ProgressBar, DocAsyncTask, Activity) 
    {
        const jQuery = $;
        console.log('flex-up');
        console.log('app version : ' + app.version);
        console.log('app version int : ' + app.int_version);
        console.log('app console debug mode : ' + app.debug);
        console.log('app license_key : ' + app.license_key);
        app.log($().jquery);

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
        
        onReady(jQuery);
    });
