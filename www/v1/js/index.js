import {Activity} from '../../flexvue/core/activity.class.js';
import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';

const onReady = ($) => 
{
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
            // template 2
            new Template(`${config.asset}/tpl/test.html`, '#tpl_test').print({ name : '유관순', age : 20 },function (tpl)
            {
                Log.v(2);
                Promise.resolve((document.querySelector('#left_docs_contents').insertAdjacentHTML('afterend',tpl ))).then(function() 
                {
                });
                
            });
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