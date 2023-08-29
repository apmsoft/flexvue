import UrlManager from '../../flexvue/core/urlmanager.class.js';

const onReady = () =>
{
    Log.d('test', {name : "홍길동"}, ["arr","b","c"], [{idx:1},{idx:2}]);
    Log.d('test');
    Log.d({name : "홍길동"});

}

// document ready
document.addEventListener("DOMContentLoaded",onReady);