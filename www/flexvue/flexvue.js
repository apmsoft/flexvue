"use strict";
const config   = {
    app_name   : 'flexvue',
    version    : '0.9.8',
    int_version: 3,
    debug      : ['d','i','w','e'], // 출력하고자 하는 디버그 모드 선택
    cache      : 'force-cache', // *default, no-cache, reload, force-cache, only-if-cached
    domain     : 'http://flexup.fancyupsoft.com',
    asset      : '../v1',
    src        : `../src`,
    res        : '../res',
    _history_state : {
        id : '#left',
        state : ''
    }
};

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
        return (Activity.lang && Activity.lang !='') ? `_${App.lang}` : '';
    }

    findPlatform (data){
        let result = '';
        for (var i=0;i<data.length;i++)
        {
			var dataString = data[i].agent;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (data[i].subagent.test(dataString)){
					result = data[i].identity;
                    break;
                }
			}
			else if (dataProp)
				result = data[i].identity;
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

class R {
    constructor(resoure_filename){
        this.constructor.res = {};
        this.constructor.resoure_filename = resoure_filename;
    }

    async parserResource (res_id)
    {
        // 옵션
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'force-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if(!R.res.hasOwnProperty(res_id)){
            const response = await fetch(this.constructor.resoure_filename, options);
            if (response.ok){
                return R.res[res_id] = await response.json();
            }
            throw new Error(response.status);
        }
    }

    static strings(column){
        if(R.res.hasOwnProperty('strings')){
            if(R.res.strings.hasOwnProperty(column)){
                return R.res.strings[column];
            }
        }
    }

    static array(column){
        if(R.res.hasOwnProperty('array')){
            if(R.res.array.hasOwnProperty(column)){
                return R.res.array[column];
            }
        }
    }

    static integers(column){
        Log.i(R.res)
        if(R.res.hasOwnProperty('integers')){
            if(R.res.integers.hasOwnProperty(column)){
                return R.res.integers[column];
            }
        }
    }
}

class ProgressBar {
    constructor(){
        this.constructor.progressObj = null;
        const loading ='<svg width="40px"  height="40px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#55ad15" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(347.727 50.0001 50.0001)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';

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
				}else if (Activity.drawer_menu && Activity.drawer_menu.classList.contains('drawer_menu_transitioned')) {
                    config._history_state.id = '#drawer_menu';
                    config._history_state.state = (Activity.history_state.drawer_menu) ? Activity.history_state.drawer_menu : Activity.history_state[Activity.push_state];
					Activity.drawer_menu.classList.toggle('drawer_transitioned');
				}else{
                    if(window.history.state !== null && window.history.state){
                        config._history_state.id = '#left';
                        config._history_state.state = window.history.state;
                    }
                }

				callback(config._history_state);
			}
		};
    }
}

class Router {
    constructor(hash,callback){
        this.init =false;
        window.addEventListener('hashchange', (evt) => 
        {
            callback(window.location.hash.replace('#',''));
        });

        if(!this.init){
            let _hash = (typeof hash !=='undefined' && typeof hash !== null) ? hash.replace('#','') : '';
            this.init = true;
            callback(_hash);
        }
    }
}