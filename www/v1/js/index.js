import {Activity} from '../../flexvue/core/activity.class.js';
import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.js';

const onReady = ($) => 
{
    // close progress
    ProgressBar.show();

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

    // 데이터 가져오기
    new AsyncTask().doGet('../res/values/strings.json', {}).then((resp)=>{
        Log.i('----->',resp);
    });

    // Log.clear();

    // 템플릿 출력
    new Template().readFile(`${config.asset}/tpl/test.html`, '#tpl_test').then((tpl)=>
    {
        const _tpl = new Template().render(tpl,{name:'ㅇ',age:10});
        Promise.resolve(document.querySelector('#left_docs_contents').innerHTML = _tpl)
        .then(function() 
        {
            // close progress
            ProgressBar.close();
        });
    }); 

    // multiout
    Promise.all([
        new AsyncTask().doGet('../res/values/strings.json', {}), 
        new Template().readFile(`${config.asset}/tpl/test3.html`, '#tpl_test3')
    ]).then((data) => {
        const tpl = data[1];
        const resp = data[0];
        document.querySelector('#multiout').innerHTML = new Template().render(tpl,resp);
    });
}

// document ready
document.addEventListener("DOMContentLoaded",function(){
    // progress
    new ProgressBar();

    // callback
    onReady();
});

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     alert(1);
//     console.log(device.cordova);
// }