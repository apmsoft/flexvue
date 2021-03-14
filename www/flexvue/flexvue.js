
const config = {
    baseUrl    : `../..`,
    version    : '0.1.1',
    int_version: 1,
    debug      : ['d','i','v','w','e'], // 출력하고자 하는 디버그 모드 선택
    cache      : 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    domain     : 'http://kfield.co.kr',
    asset      : '../v1',
    src        : 'http://kfield.co.kr/src',
    res        : '../res'
};

// application
class App {
    static browser = 'unknown';
    static os = 'unknown';
    static version ='unknown';
    static lang = 'ko';

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
