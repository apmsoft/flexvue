"use strict";
const config   = {
    app_name     : 'flexvue',
    version      : '2.4.1',
    int_version  : 14,
    surport_langs: [],
    debug        : ['d','i','v','w','e'], // 출력하고자 하는 디버그 모드 선택
    cache        : 'default', // *default, no-cache, reload, force-cache, only-if-cached
    domain       : 'http://',
    _headers_ : {
        'Authorization-Access-Token'  : '',
        'Authorization-Manager-Token' : '',
        'Content-Type'                : 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
    },
    
    _fileupload_headers_ : {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Authorization-Access-Token'  : ''
    },
    _options_ : {cache: 'no-cache'},
    asset: 'v1',
    src  : `src`,
    res  : 'res',
    _history_state : {
        id : '#left',
        state : ''
    }
};

class Observable {
    constructor(channel){
        this.observers = this._makeChannel(channel);
    }

    _makeChannel (channel){
        Log.d('>>'+channel);
        let ch = (channel && channel !=='undefined') ? channel : ['public'];
        ch.forEach(element => ch[element] = []);
    return ch;
    }

    subscribe(channel, o) {
        const _channel = this._findChannel(channel);

        // console.log('////'+_channel);
        if(_channel !==undefined){
            const even = (_o) => _o.constructor.name === o.constructor.name;
            let is_o_found = this.observers[_channel].some(even);
            if(!is_o_found){
                this.observers[_channel].push(o);
            }
            Log.d(this.observers);
        }
    }

    _findChannel (channel){
        const keys = Object.keys(this.observers);
        let found = keys.find(element => element == channel);
        if(found ===undefined){
        found = 'public';
        }
    return found;
    }

    unsubscribe(channel, o){
        const _channel = this._findChannel(channel);
        this.observers[_channel] = this.observers[_channel].filter(subscriber => subscriber !== o);
    }

    notify(channel, message){
        const _channel = this._findChannel(channel);
        this.observers[_channel].forEach(observer => observer.update(message));
    }
}

class ScrollObserver {
    constructor (channel){
        this.constructor.channels = this._makeChannel(channel);
        Log.d(this.channels);
    }

    _makeChannel (channel){
        let ch = (channel && channel !=='undefined') ? channel : ['public'];
        ch.forEach(element => ch[element] = 0);
        return ch;
    }

    static _findChannel (channel){
        const keys = Object.keys(ScrollObserver.channels);
        let found = keys.find(element => element == channel);
        if(found ===undefined){
            found = '';
        }
    return found;
    }

    static _setPos (channel, pos){
        if(ScrollObserver._findChannel(channel)){
            ScrollObserver.channels[channel] = pos;
        }
    }

    static _getPos (channel){
        let pos = 0;
        if(ScrollObserver._findChannel(channel)){
            pos = ScrollObserver.channels[channel];
        }
    return pos;
    }
}

const OS = [
    {
        agent : navigator.platform,
        subagent : /Win/i,
        identity: "Windows"
    },
    {
        agent : navigator.userAgent,
        subagent : /IEMobile/i,
        identity: "IEMobile"
    },
    {
        agent : navigator.userAgent,
        subagent : /Android/i,
        identity: "Android"
    },
    {
        agent : navigator.platform,
        subagent : /Mac/i,
        identity: "Mac"
    },
    {
        agent : navigator.userAgent,
        subagent : /iPhone/i,
        identity: "iPhone"
    },
    {
        agent : navigator.platform,
        subagent : /Linux/i,
        identity: "Linux"
    }
];
const browsers = [
    {
        agent : navigator.userAgent,
        subagent : /Chrome/i,
        identity: "Chrome"
    },
    { 	agent : navigator.userAgent,
        subagent : /OmniWeb/i,
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    },
    {
        agent : navigator.vendor,
        subagent : /Apple/i,
        identity: "Safari",
        versionSearch: "Version"
    },
    {
        prop: window.opera,
        identity: /Opera/i,
        versionSearch: "Version"
    },
    {
        agent : navigator.vendor,
        subagent : /iCab/i,
        identity: "iCab"
    },
    {
        agent : navigator.vendor,
        subagent : /KDE/i,
        identity: "Konqueror"
    },
    {
        agent : navigator.userAgent,
        subagent : /Firefox/i,
        identity: "Firefox"
    },
    {
        agent : navigator.vendor,
        subagent : /Camino/i,
        identity: "Camino"
    },
    {
        agent : navigator.userAgent,
        subagent : /Netscape/i,
        identity: "Netscape"
    },
    {
        agent : navigator.userAgent,
        subagent : /MSIE/i,
        identity: "Explorer",
        versionSearch: "MSIE"
    },
    {
        agent : navigator.userAgent,
        subagent : /Gecko/i,
        identity: "Mozilla",
        versionSearch: "rv"
    },
    {
        agent : navigator.userAgent,
        subagent : /Mozilla/i,
        identity: "Netscape",
        versionSearch: "Mozilla"
    }
];

// application
class App {
    constructor(){
        this.constructor.browser = this.findPlatform(browsers) || "unknown";
		this.constructor.version = this.getPlatformVersion(navigator.userAgent)
			|| this.getPlatformVersion(navigator.appVersion)
			|| "unknown";
        this.constructor.os = this.findPlatform(OS) || "unknown";
        this.constructor.lang = this.getLanguage() || '';
    }

    static getLocale(){
        let language = '';
        config.surport_langs.forEach(function(lng){
            if(App.lang == lng){
                language = '_'+lng;
            }
        });
        return (language) ? language : '';
    }

    findPlatform (data){
        let result = '';
        for (var i=0;i<data.length;i++)
        {
            var dataString = data[i].agent;
            var dataProp   = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (data[i].subagent.test(dataString)){
                    result = data[i].identity;
                break;
                }
            }
            else if (dataProp){
                result = data[i].identity;
            }
        }
        return result;
    }

    getPlatformVersion (data){
        var index = data.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(data.substring(index+this.versionSearchString.length+1));
    }

    getLanguage() {
        let language = navigator.language || navigator.userLanguage;
        language = language.toLowerCase();
        language = language.substring(0, 2); //앞 2글자
        if(language=='cn' || language=='tw' || language=='zh'){
            language = cn;
        }
        return language;
    }
}

// console.log
class Log {
    static d (...args) {
        if(config.debug.some(el => el == 'd'))
            args.forEach( d => console.log(echoNowDate()+' >> D : ', d));
    }

    static i (...args) {
        if(config.debug.some(el => el == 'i'))
            args.forEach( d => console.log(echoNowDate()+' >> I : ', d));
    }

    static v (...args) {
        if(config.debug.some(el => el == 'v'))
            args.forEach( d => console.log(echoNowDate()+' >> V : ', d));
    }

    static w (...args) {
        if(config.debug.some(el => el == 'w'))
            args.forEach( d => console.log(echoNowDate()+' >> W : ', d));
    }

    static e (...args) {
        if(config.debug.some(el => el == 'e'))
            args.forEach( d => console.log(echoNowDate()+' >> E : ', d));
    }

    static clear(){
        console.clear();
    }
}
class ProgressBar {
    constructor(load=''){
        this.constructor.progressObj = null;
        const loading = load || '<svg width="40px"  height="40px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#55ad15" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(347.727 50.0001 50.0001)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';

        Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',`<div id="loading" class="loading">${loading}</div>`)))
        .then(function() {
            ProgressBar.progressObj = document.querySelector('#loading');
        });
    }

    static show(){
        Handler.post(function() {
            ProgressBar.progressObj.style.display = 'block';
        }, 10);
    }

    static close(){
        Handler.post(function() {
            ProgressBar.progressObj.style.display = 'none';
        }, 100);
    }
}

// 현재 시간 출력
function echoNowDate(){
    const today = new Date();

    const dayNames = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
    // getDay: 해당 요일(0 ~ 6)를 나타내는 정수를 반환한다.
    const day = dayNames[today.getDay()];

    const year = today.getFullYear();
    let month  = today.getMonth() + 1;
    const date = today.getDate();
    let hour   = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // 12시간제로 변경
    hour %= 12;
    hour = hour || 12; // 0 => 12

    // 10미만인 분과 초를 2자리로 변경
    month = month < 10 ? '0' + month : month;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return `${year}-${month}-${date} ${ampm} ${hour}:${minute}:${second}`;
}

window.Runnable = (function (callback) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
        if(typeof callback === 'function'){
            window.setTimeout(callback);
        }
    };
})();

const Handler = {
    post (callback, delay){
        setTimeout(()=>{
            Runnable(callback,0);
        }, delay);
    }
};

const On = (evt) => function(target, callback){
    {
        if(target.indexOf('#')){
            const element = document.querySelector(target);
            if(element){
                element.addEventListener(evt, function(e){
                    if(typeof callback === 'function'){
                        callback(e, this);
                    }
                });
            }
        }else{
            const element = document.querySelectorAll(target);
            if(element){
                element.forEach(el=> {
                    el.addEventListener(evt,function(e){
                        if(typeof callback === 'function'){
                            callback(e, el);
                        }
                    });
                })
            }
        }
    }
};

class Activity {
	constructor(){
		this.constructor.bottomthird = document.querySelector("#bottomthird");
		this.constructor.bottomside = document.querySelector("#bottomside");
		this.constructor.bottom = document.querySelector("#bottom");
		this.constructor.rightthird = document.querySelector("#rightthird");
		this.constructor.rightside = document.querySelector("#rightside");
		this.constructor.right = document.querySelector("#right");
    this.constructor.drawer_menu = document.querySelector("#drawer_menu");

    this.constructor.layout_panel = { 
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
        drawer_menu: {
            id:'#drawer_menu',
            target:'#drawer_menu',
            toggle:'drawer_transitioned'
        }
    }

    this.constructor.push_state = '';
    this.constructor.history_state = {
        'left' : '',
        'right' : '',
        'rightside' : '',
        'rightthird' : '',
        'bottom' : '',
        'bottomside' : '',
        'bottomthird':'',
        'drawer_menu':''
    };
	}

	onCreateView(){
		
	}

    static inentView(url,delaytime = 0){
        Handler.post(()=>{
            window.location.href = url;
        },delaytime);
    }

    static onStart (panel_id)
    {
        if(panel_id !==null)
        {
            Activity.push_state = (panel_id) ? panel_id.replace('#','') : '';
            if(typeof window.location.hash !=='undefined'){
                Activity.history_state[Activity.push_state] = window.location.hash;
            }
            
            let panel = Activity.layout_panel[Activity.push_state];
            if (panel.target !== null)
            {
                let classname = panel.toggle;
                if (!document.querySelector(panel.id).classList.contains(classname)) 
                {
                    Handler.post(()=>{
                        // toggle
                        document.querySelector(panel.target).classList.toggle(classname);
                    },10);
                }
            }
        }
    }

    static onStop (panel_id){
        panel_id = (panel_id) ? panel_id.replace('#','') : '';

        switch(panel_id){
            case 'bottomthird':
                if (Activity.bottomthird && Activity.bottomthird.classList.contains('bottomthird_transitioned')) {
                    Activity.bottomthird.classList.toggle('bottomthird_transitioned');
                }
            break;
            case 'bottomside':
                if (Activity.bottomside && Activity.bottomside.classList.contains('bottomside_transitioned')) {
                    Activity.bottomside.classList.toggle('bottomside_transitioned');
                }
            case 'bottom':
                if (Activity.bottom && Activity.bottom.classList.contains('bottom_transitioned')) {
                    Activity.bottom.classList.toggle('bottom_transitioned');
                }
            break;
            case 'rightthird' :
                if (Activity.rightthird && Activity.rightthird.classList.contains('rightthird_transitioned')) {
                    Activity.rightthird.classList.toggle('rightthird_transitioned');
                }
            break;
            case 'rightside' :
                if (Activity.rightside && Activity.rightside.classList.contains('rightside_transitioned')) {
                    Activity.rightside.classList.toggle('rightside_transitioned');
                }
            break;
            case 'right':
                if (Activity.right && Activity.right.classList.contains('transitioned')) {
                    Activity.right.classList.toggle('transitioned');
                }
            break;
            case 'drawer_menu':
                if (Activity.drawer_menu && Activity.drawer_menu.classList.contains('drawer_transitioned')) {
                    Activity.drawer_menu.classList.toggle('drawer_transitioned');
                }
            break;
        }
    }

    onBackPressed (callback) 
    {
        window.onpopstate = function(event) 
		{
			let is_Trustred = false;
			if (typeof event.isTrusted !=='undefined' && event.isTrusted) {
				is_Trustred = true;
			} else if (typeof event.state !=='undefined' && event.state != 'null') {
				is_Trustred = true;
			}

			if (is_Trustred) 
			{
				// 이전경로 do 체크
                config._history_state = {
                    id : '#left',
                    state : ''
                };

				// 이전경로 do 체크
				if (Activity.bottomthird && Activity.bottomthird.classList.contains('bottomthird_transitioned')) {
                    config._history_state.id = '#bottomthird';
                    config._history_state.state = (Activity.history_state.bottomthird) ? Activity.history_state.bottomthird : Activity.history_state[Activity.push_state];
                    Activity.bottomthird.classList.toggle('bottomthird_transitioned');
                } else if (Activity.bottomside && Activity.bottomside.classList.contains('bottomside_transitioned')) {
                    config._history_state.id = '#bottomside';
                    config._history_state.state = (Activity.history_state.bottomside) ? Activity.history_state.bottomside : Activity.history_state[Activity.push_state];
                    Activity.bottomside.classList.toggle('bottomside_transitioned');
                } else if (Activity.bottom && Activity.bottom.classList.contains('bottom_transitioned')) {
                    config._history_state.id = '#bottom';
                    config._history_state.state = (Activity.history_state.bottom) ? Activity.history_state.bottom : Activity.history_state[Activity.push_state];
                    Activity.bottom.classList.toggle('bottom_transitioned');
                } else if (Activity.rightthird && Activity.rightthird.classList.contains('rightthird_transitioned')) {
                    config._history_state.id = '#rightthird';
                    config._history_state.state = (Activity.history_state.rightthird) ? Activity.history_state.rightthird : Activity.history_state[Activity.push_state];
                    Activity.rightthird.classList.toggle('rightthird_transitioned');
                } else if (Activity.rightside && Activity.rightside.classList.contains('rightside_transitioned')) {
                    config._history_state.id = '#rightside';
                    config._history_state.state = (Activity.history_state.rightside) ? Activity.history_state.rightside : Activity.history_state[Activity.push_state];
                    Activity.rightside.classList.toggle('rightside_transitioned');
                } else if (Activity.right && Activity.right.classList.contains('transitioned')) {
                    config._history_state.id = '#right';
                    config._history_state.state = (Activity.history_state.right) ? Activity.history_state.right : Activity.history_state[Activity.push_state];
                    Activity.right.classList.toggle('transitioned');
                }else if (Activity.drawer_menu && Activity.drawer_menu.classList.contains('drawer_transitioned')) {
                    config._history_state.id = '#drawer_menu';
                    config._history_state.state = (Activity.history_state.drawer_menu) ? Activity.history_state.drawer_menu : Activity.history_state[Activity.push_state];
                    Activity.drawer_menu.classList.toggle('drawer_transitioned');
                }else{
                    config._history_state.id = '#left';
                    config._history_state.state = (Activity.history_state.left) ? Activity.history_state.left : Activity.history_state[Activity.push_state];
                }

				callback(config._history_state);
			}
		};
    }

    // 뒤로가기 버튼 활성화
    static onBackButtonEvent(id,callback){
        const btn_backey = document.querySelector(id);
        if(btn_backey){
            btn_backey.addEventListener('click',function(e){
                e.preventDefault();
                
                if(typeof callback == 'function'){
                    callback(new URL(window.location.href));
                }
                else{
                    history.go(-1);
                }
            });
        }
    }
}

class Router {
    constructor(hash){
        this.init =false;
        this.hash = hash;
    }

    filter (callback) {
        const self = this;
        window.addEventListener('hashchange', (evt) => 
        {
            const pathinfo = self.pathinfo(window.location.hash.replace('#',''));
            callback(pathinfo);
        });

        if(!this.init){
            let _hash = (typeof this.hash !=='undefined' && typeof this.hash !== null) ? this.hash.replace('#','') : '';
            this.init = true;
            const pathinfo = self.pathinfo(_hash);
            callback(pathinfo);
        }
    }

    pathinfo (hash) 
    {
        const pathinfo = {
            'url' : '',
            'path' :'/',
            'parse_path' : [],
            'query_string' : '',
            'parse_query' : {}
        };

        pathinfo.url = '#'+hash;

        // 패턴
        const path_pattern = /[\/](\w+)/gi;
        if( (path_pattern).test(hash) )
        {
            // path
            let path = hash.match(path_pattern);
            const parse_path = path.map(function(h){
                const pathname = h.replace(/\/$/, '');
                pathinfo.parse_path.push(pathname);
                return pathname;
            });

            // params
            let send_params = {};
            const params_pattern = /(\w+)=(.*)/g;
            if( (params_pattern).test(hash) ){
                pathinfo.query_string = hash.match(params_pattern)[0];
                pathinfo.parse_query = Object.assign( send_params , Object.fromEntries( new URLSearchParams(pathinfo.query_string) ));
            }

            // run module
            pathinfo.path = parse_path.join('');
        }

        return pathinfo;
    }
}