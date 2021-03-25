"use strict";
import {Template} from '../../flexvue/core/template.class.min.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.min.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.min.js';

/** ZingTouch */
import ZingTouch from '../../flexvue/zingtouch/ZingTouch.min.js';

/** ckeditor5 */
import {} from '../../flexvue/ckeditor5/ckeditor.js';

/** flatpickr */
import {} from '../../flexvue/flatpickr/l10n/ko.js';
import {} from '../../flexvue/flatpickr/flatpickr.min.js';

/** filepond */
import {} from '../../flexvue/filepond/dist/filepond-plugin-file-validate-size.min.js';
import {} from '../../flexvue/filepond/dist/filepond-plugin-file-validate-type.min.js';
import {} from '../../flexvue/filepond/dist/filepond-plugin-image-preview.min.js';
import * as FilePond from '../../flexvue/filepond/dist/filepond.esm.min.js';

/** chartjs */
import {} from '../../flexvue/chartjs/dist/Chart.min.js';

/** swiperjs */
import Swiper from '../../flexvue/swiper/swiper-bundle.esm.browser.min.js';

/** daum postcode & map */
import {DaumPostMap} from '../../flexvue/daumpostmap/daumpostmap.js';

/** nouislider */
import {} from '../../flexvue/nouislider/nouislider.min.js';

const onReady = () => 
{
    // R 리소스 가져오기
    new R(`${config.res}/values/strings${App.getLocale()}.json`).parserResource('strings');

    // activity
    new Activity().onCreateView();
    Activity.onBackPressed((state)=>{
        Log.i('onBackPressed : '+state);
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
    // urlManager.pushState('index','인텍스', `${urlManager.pathname}/index.html?${urlManager.makeJSON2URL(urlManager.url_params)}`);

    //
    flatpickr("#start_date", {
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d",
        'local' : ko
    });
    flatpickr.localize(flatpickr.l10ns.ko);

    // filepond
    FilePond.registerPlugin(
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );

    // target
    const inputElement = document.querySelector('input[type="file"]');

    // create a FilePond instance at the input element location
    const pond = FilePond.create( inputElement,{
        name: inputElement,
        maxFiles: 1,
        allowBrowse: true,
        allowImagePreview: true,
        // server: {
        //     url: config.src+'/popup/upload',
        //     process: {
        //         url: '/process.php',
        //         method: 'POST',
        //         withCredentials: false,
        //         headers: {},
        //         timeout: 7000,
        //         onload: (response) => {
        //             console.log('onload');
        //             console.log(response);
        //             return response.key;
        //         },
        //         onerror: (response) => {
        //             console.log('onerror');
        //             console.log(response);
        //             return response.data;
        //         },
        //         ondata: (formData) => {
        //             formData.append('extract_id', resp.msg.extract_id);
        //             return formData;
        //         }
        //     },
        //     revert : null,
        //     load : null,
        //     fetch : null,
        //     restore : null
        // }
    });

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'vertical',
        loop: true,
      
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      });

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
        Log.e( error );
    });

    // 우편번호 검색 및 맵
    // const daumPostMap = new DaumPostMap('#btn-find-postcode' , null, null);
    // daumPostMap.doPostCodeAddress('#postcode', '#load_address1','#dong_address1');

    // 앱 정보
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    App.lang = '';
    Log.i(App.lang);

    // 핸들러
    Handler.post(() => Log.d('Handler post'));

    // 템플릿 출력
    new Template().readFile(`../test/tpl/test${App.getLocale()}.html`, '#tpl_test').then((tpl)=>
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
            new AsyncTask().doImport('../../test/js/notice.class.js').then(Module => {
                const notice = new Module.Notice();
                notice.doList({page:1});
            });
        },false);
    }).finally(()=>{ProgressBar.close();}); 

    // nouislider css
    Handler.post(()=>{
        new AsyncTask().doImportCss('../flexvue/nouislider/nouislider.min.css').then(()=>
        {
            Log.d('completed');
            
        });
    },0);

    // nouislider run
    let handlesSlider4 = document.getElementById('slider-handles4');
    noUiSlider.create(handlesSlider4, {
        start: [4000, 8000, 12000, 16000],
        connect: [false, true, true, false, true],
        range: {
            'min': [2000],
            'max': [20000]
        }
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     alert(1);
//     console.log(device.cordova);
// }