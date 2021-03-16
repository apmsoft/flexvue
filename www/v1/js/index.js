import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.js';
import ZingTouch from '../../flexvue/zingtouch/ZingTouch.js';
// import ClassicEditor from '../../flexvue/ckeditor5/ckeditor.js';

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
        Log.i('ZingTouch >> '+e.detail.interval);
    });

    const urlManager = new UrlManager(document.location);
    urlManager.pushState('index','인텍스', `./?${urlManager.makeJSON2URL(urlManager.url_params)}`);

    console.log('onReady');
    Log.i('config ',config.version);

    //
    flatpickr("#start_date", {
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d"
    });
    flatpickr.localize(flatpickr.l10ns.ko);

    // filepond
    FilePond.registerPlugin(
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );
    // get a reference to the input element
    const inputElement = document.querySelector('input[type="file"]');

    // create a FilePond instance at the input element location
    const pond = FilePond.create( inputElement,{
        name: inputElement,
        maxFiles: 1,
        allowBrowse: true,
        server: {
            url: config.src+'/popup/upload',
            process: {
                url: '/process.php',
                method: 'POST',
                withCredentials: false,
                headers: {},
                timeout: 7000,
                onload: (response) => {
                    console.log('onload');
                    console.log(response);
                    return response.key;
                },
                onerror: (response) => {
                    console.log('onerror');
                    console.log(response);
                    return response.data;
                },
                ondata: (formData) => {
                    formData.append('extract_id', resp.msg.extract_id);
                    return formData;
                }
            },
            revert : null,
            load : null,
            fetch : null,
            restore : null
        }
    } );

    // editor
    ClassicEditor.create( document.querySelector( '#description' ),{
        toolbar: {
            items: [
                'heading','|','bold','italic','link','|','blockQuote','insertTable','mediaEmbed','undo','redo'
            ]
        },
        language: 'ko'
    })
    .then(editor => {
        window.editor = editor;
        window.editor.editing.view.focus();

        // $('.ck-editor').addClass('noSwipe');
    })
    .catch( error => {
        console.error( error );
    });

    // 앱 정보
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    App.lang = '';
    Log.i(App.lang);

    // 핸들러
    Handler.post(() => Log.d('Handler post'));

    // 데이터 가져오기
    new AsyncTask().doGet(`../res/values/strings${App.glueLang}.json`, {}).then((resp)=>{
        Log.i('----->',resp);
    });

    // 템플릿 출력
    new Template().readFile(`${config.asset}/tpl/test${App.glueLang}.html`, '#tpl_test').then((tpl)=>
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