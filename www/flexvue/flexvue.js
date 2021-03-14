
const config = {
    baseUrl    : '../flexvue',
    version    : '0.1.0',
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
            args.forEach( d => console.log('>> D : ', d));
    }

    static i (...args) {
        if(config.debug.some(el => el == 'i'))
            args.forEach( d => console.log('>> I : ', d));
    }

    static v (...args) {
        if(config.debug.some(el => el == 'v'))
            args.forEach( d => console.log('>> V : ', d));
    }

    static w (...args) {
        if(config.debug.some(el => el == 'w'))
            args.forEach( d => console.log('>> W : ', d));
    }

    static e (...args) {
        if(config.debug.some(el => el == 'e'))
            args.forEach( d => console.log('>> E : ', d));
    }
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
