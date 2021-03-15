import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.js';
import ZingTouch from '../../flexvue/zingtouch/ZingTouch.js';

const onReady = () => 
{
    // activity
    new Activity().onCreateView();
    Activity.onBackPressed((state)=>{
        Log.i('onBackPressed : '+state);
        history.go(-1);
    });

    // progress init
    new ProgressBar();

    // show progress
    ProgressBar.show();

    // 터치
    var myRegion = new ZingTouch.Region(document.body);
    var myElement = document.getElementById('left_docs_contents');

    myRegion.bind(myElement, 'tap', function(e) {
        console.log(e);
    });

    const urlManager = new UrlManager(document.location);
    // urlManager.pushState('index','인텍스', `./?${urlManager.makeJSON2URL(urlManager.url_params)}`);

    console.log('onReady');
    Log.i('config ',config.version);

    //
    flatpickr("#start_date", {
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d"
    });
    flatpickr.localize(flatpickr.l10ns.ko);

    // 앱 정보
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    App.lang = 'en';
    Log.i(App.lang);

    // 핸들러
    Handler.post(() => Log.d('Handler post'));

    // 데이터 가져오기
    new AsyncTask().doGet('../res/values/strings.json', {}).then((resp)=>{
        Log.i('----->',resp);
    });

    // 템플릿 출력
    new Template().readFile(`${config.asset}/tpl/test.html`, '#tpl_test').then((tpl)=>
    {
        new Promise((resolve)=>{
            const _tpl = new Template().render(tpl,{name:'ㅇ',age:10});
            document.querySelector('#left_docs_contents').innerHTML = _tpl;
            resolve(true);
        }); 
    }).then((data)=>{
        // 게시판
        document.querySelector('#btn-test').addEventListener('click', (el)=>{
            // import module
            new AsyncTask().doImport('../../v1/js/notice.class.js').then(Module => {
                const notice = new Module.Notice();
                notice.doList({page:1});
            });
        },false);
    }).finally(()=>{ProgressBar.close();}); 

}

// document ready
document.addEventListener("DOMContentLoaded",function(){
    // callback
    onReady();
});

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     alert(1);
//     console.log(device.cordova);
// }