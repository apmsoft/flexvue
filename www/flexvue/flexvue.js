const config   = {
    app_name   : 'flexup',
    version    : '0.1.1',
    int_version: 1,
    debug      : ['d','i','v','w','e'], // 출력하고자 하는 디버그 모드 선택
    cache      : 'force-cache', // *default, no-cache, reload, force-cache, only-if-cached
    domain     : 'http://flexup.fancyupsoft.com',
    asset      : '../v1',
    src        : `http://flexup.fancyupsoft.com/src`,
    res        : '../res'
};

// application
class App {
    static browser = 'unknown';
    static os = 'unknown';
    static version ='unknown';
    static lang = ''; // ko,en,jp

    browsers = [
		{
			agent : navigator.userAgent,
			subagent : "Chrome",
			identity: "Chrome"
		},
		{ 	agent : navigator.userAgent,
			subagent : "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			agent : navigator.vendor,
			subagent : "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			agent : navigator.vendor,
			subagent : "iCab",
			identity: "iCab"
		},
		{
			agent : navigator.vendor,
			subagent : "KDE",
			identity: "Konqueror"
		},
		{
			agent : navigator.userAgent,
			subagent : "Firefox",
			identity: "Firefox"
		},
		{
			agent : navigator.vendor,
			subagent : "Camino",
			identity: "Camino"
		},
		{
			agent : navigator.userAgent,
			subagent : "Netscape",
			identity: "Netscape"
		},
		{
			agent : navigator.userAgent,
			subagent : "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			agent : navigator.userAgent,
			subagent : "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{
			agent : navigator.userAgent,
			subagent : "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	];

	OS = [
		{
			agent : navigator.platform,
			subagent : "Win",
			identity: "Windows"
		},
        {
			agent : navigator.platform,
			subagent : "Android",
			identity: "Android"
		},
		{
			agent : navigator.platform,
			subagent : "Mac",
			identity: "Mac"
		},
		{
			   agent : navigator.userAgent,
			   subagent : "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			agent : navigator.platform,
			subagent : "Linux",
			identity: "Linux"
		}
	];

    constructor(){
        this.constructor.browser = this.findPlatform(this.browsers) || "unknown";
		this.constructor.version = this.getPlatformVersion(navigator.userAgent)
			|| this.getPlatformVersion(navigator.appVersion)
			|| "unknown";
        this.constructor.os = this.findPlatform(this.OS) || "unknown";
        this.constructor.lang = this.getLanguage() || '';
    }

    static getLocale(){
        return (Activity.lang && Activity.lang !='') ? `_${App.lang}` : '';
    }

    findPlatform (data){
        for (var i=0;i<data.length;i++)
        {
			var dataString = data[i].agent;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subagent) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
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

class R {
    static res = {};
    constructor(resoure_filename){
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
    static progressObj = null;
    constructor(){
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

	static bottomthird = null;
	static bottomside = null;
	static bottom = null;
	static rightthird = null;
	static rightside = null;
	static right = null;

	static bottomthird_back_button = null;
	static bottomside_back_button = null;
	static bottom_back_button = null;
	static rightthird_back_button = null;
	static rightside_back_button = null;
	static right_back_button = null;

	static bottomthird_title = null;
	static bottomside_title = null;
	static bottom_title = null;
	static rightthird_title = null;
	static rightside_title = null;
	static right_title = null;
	static left_title = null;
	
    static push_state = '';
	static history_state = {
        'left' : '',
        'right' : '',
        'rightside' : '',
        'rightthird' : '',
        'bottom' : '',
        'bottomside' : '',
        'bottomthird':'',
        'drawer_menu':''
    };

    static layout_panel = { 
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
        }
    }

	constructor(){
		this.constructor.bottomthird = document.querySelector("#bottomthird");
		this.constructor.bottomside = document.querySelector("#bottomside");
		this.constructor.bottom = document.querySelector("#bottom");
		this.constructor.rightthird = document.querySelector("#rightthird");
		this.constructor.rightside = document.querySelector("#rightside");
		this.constructor.right = document.querySelector("#right");

		this.constructor.bottomthird_back_button = document.querySelector("#bottomthird_back_button");
		this.constructor.bottomside_back_button = document.querySelector("#bottomside_back_button");
		this.constructor.bottom_back_button = document.querySelector("#bottom_back_button");
		this.constructor.rightthird_back_button = document.querySelector("#rightthird_back_button");
		this.constructor.rightside_back_button = document.querySelector("#rightside_back_button");
		this.constructor.right_back_button = document.querySelector("#right_back_button");

		this.constructor.bottomthird_title = document.querySelector("#bottomthird_title");
		this.constructor.bottomside_title = document.querySelector("#bottomside_title");
		this.constructor.bottom_title = document.querySelector("#bottom_title");
		this.constructor.rightthird_title = document.querySelector("#rightthird_title");
		this.constructor.rightside_title = document.querySelector("#rightside_title");
		this.constructor.right_title = document.querySelector("#right_title");
		this.constructor.left_title = document.querySelector("#left_title");
	}

	onCreateView(){
		if(Activity.bottom_back_button){ Activity.bottom_back_button.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.bottomside_back_button){ Activity.bottomside_back_button.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.bottomthird_back_button) { Activity.bottomthird_back_button.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.right_back_button) { Activity.right_back_button.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.rightside_back_button){ Activity.rightside_back_button.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.rightthird_back_button) { Activity.rightthird_back_button.addEventListener("click", () => { history.go(-1); }, false); }

		if(Activity.bottom_title){ Activity.bottom_title.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.bottomside_title){ Activity.bottomside_title.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.bottomthird_title) { Activity.bottomthird_title.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.right_title) { Activity.right_title.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.rightside_title){ Activity.rightside_title.addEventListener("click", () => { history.go(-1); }, false); }
		if(Activity.rightthird_title) { Activity.rightthird_title.addEventListener("click", () => { history.go(-1); }, false); }
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
                    document.querySelector('#bottomthird_docs_contents').innerHTML ='';
                    Activity.bottomthird.classList.toggle('bottomthird_transitioned');
                }
            break;
            case 'bottomside':
                if (Activity.bottomside && Activity.bottomside.classList.contains('bottomside_transitioned')) {
                    document.querySelector('#bottomside_docs_contents').innerHTML ='';
                    Activity.bottomside.classList.toggle('bottomside_transitioned');
                }
            case 'bottom':
                if (Activity.bottom && Activity.bottom.classList.contains('bottom_transitioned')) {
                    document.querySelector('#bottom_docs_contents').innerHTML ='';
                    Activity.bottom.classList.toggle('bottom_transitioned');
                }
            break;
            case 'rightthird' :
                if (Activity.rightthird && Activity.rightthird.classList.contains('rightthird_transitioned')) {
                    document.querySelector('#rightthird_docs_contents').innerHTML ='';
                    Activity.rightthird.classList.toggle('rightthird_transitioned');
                }
            break;
            case 'rightside' :
                if (Activity.rightside && Activity.rightside.classList.contains('rightside_transitioned')) {
                    document.querySelector('#rightside_docs_contents').innerHTML ='';
                    Activity.rightside.classList.toggle('rightside_transitioned');
                }
            break;
            case 'right':
                if (Activity.right && Activity.right.classList.contains('transitioned')) {
                    document.querySelector('#right_docs_contents').innerHTML ='';
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

    static onBackPressed (callback) 
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
                let _history_state = '';

				if (Activity.bottomthird && Activity.bottomthird.classList.contains('bottomthird_transitioned')) {
                    _history_state = Activity.history_state.bottomthird;
					Activity.onStop('#bottomthird');
				} else if (Activity.bottomside && Activity.bottomside.classList.contains('bottomside_transitioned')) {
                    _history_state = Activity.history_state.bottomside;
					Activity.onStop('#bottomside');
				} else if (Activity.bottom && Activity.bottom.classList.contains('bottom_transitioned')) {
                    _history_state = Activity.history_state.bottom;
					Activity.onStop('#bottom');
				} else if (Activity.rightthird && Activity.rightthird.classList.contains('rightthird_transitioned')) {
                    _history_state = Activity.history_state.rightthird;
					Activity.onStop('#rightthird');
				} else if (Activity.rightside && Activity.rightside.classList.contains('rightside_transitioned')) {
                    _history_state = Activity.history_state.rightside;
					Activity.onStop('#rightside');
				} else if (Activity.right && Activity.right.classList.contains('transitioned')) {
                    _history_state = Activity.history_state.right;
					Activity.onStop('#right');
				}else if (Activity.drawer_menu && Activity.drawer_menu.classList.contains('drawer_menu_transitioned')) {
                    _history_state = Activity.history_state.drawer_menu;
					Activity.onStop('#drawer_menu');
				}else{
                    if(window.history.state !== null && window.history.state){
                        _history_state = window.history.state;
                    }
                }

				callback(_history_state);
			}
		};
    }
}