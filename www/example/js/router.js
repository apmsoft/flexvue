import UrlManager from '../../flexvue/core/urlmanager.class.js';

const onReady = () => 
{
    new Activity().onBackPressed( state =>{ 
        Log.d('onBackPressed : ------>',state);
    });

    // #docs/start : hash 경로가 바뀔때 마다 호출 됩니다
    const urlManager = new UrlManager(document.location);


    const routes = {
        '/' : `../../js/index.js`,
        '/bbs/notice' : `../../js/bbs.js`,
        '/bbs/notice/list' : `../../js/bbs.js`,
    };

    //#bbs/notice/list/page=1&q=노래방&category=a
    new Router().filter(urlManager.hash).pathinfo(function(pathinfo){
        Log.d(pathinfo);
        Log.d(routes[pathinfo.path]);
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);