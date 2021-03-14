import {Activity} from '../../flexvue/core/activity.class.js';
import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.js';

const onReady = ($) => 
{
    const urlManager = new UrlManager(document.location);
    // urlManager.pushState('index','인텍스', `./?${urlManager.makeJSON2URL(urlManager.url_params)}`);

    console.log('onReady');
    Log.i('config ',config.version);

    // activity
    const activity = new Activity();

    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    App.lang = 'en';
    Log.i(App.lang);

    Handler.post(() => Log.d('Handler post'));

    // Log.clear();

    // template 1
    new Template(`${config.asset}/tpl/test.html`, '#tpl_test').print({ name : '홍길동', age : 30 },function (tpl)
    {
        Log.v(1);
        Promise.resolve((document.querySelector('#left_docs_contents').innerHTML = tpl )).then(function() 
        {
            document.querySelector('#btn-test').addEventListener('click', (el)=>{
                import('../../v1/js/notice.class.js') .then((Module) => {
                    const notice = new Module.Notice();
                    notice.doList({page:1});
                });
                
            },false);
            document.querySelector('#btn-test2').addEventListener('click', (el)=>{
                alert('2');
            },false);
        });
    }); 
}

// document ready
document.addEventListener("DOMContentLoaded",function(){
    onReady();
});

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     alert(1);
//     console.log(device.cordova);
// }