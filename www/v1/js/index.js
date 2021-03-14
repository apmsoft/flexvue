import {Activity} from '../../flexvue/core/activity.class.js';
import {Template} from '../../flexvue/core/template.class.js';

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

    // template
    const template = new Template(`${config.asset}/tpl/test.html`, '#tpl_test');
    template.print('#left_docs_contents', { name : '홍길동', age : 30 },function (){
        Log.v('2');
    });

    Handler.post(()=>{
        template.print('#afterid', { name : '유관순', age : 20 },function (){
            Log.v('3');
        });
    },300);
    
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