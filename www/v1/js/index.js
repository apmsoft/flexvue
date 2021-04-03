import {Template} from '../../flexvue/core/template.class.min.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.min.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.min.js';

/** lazyload */
import LazyLoad from '../../flexvue/plugins/lazyload/lazyload.esm.min.js';

const onReady = () => 
{
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    
    // activity
    new Activity().onCreateView();
    Activity.onBackPressed((state)=>{
        Log.i('onBackPressed : '+state);
    });


    // progress init
    new ProgressBar();

    // show progress
    ProgressBar.show();

    // urlmanager
    const urlManager = new UrlManager(window.location);

    class MyActivity {
        constructor(){
            document.querySelector('#nav').querySelectorAll('a').forEach((el)=>{
                el.addEventListener('click', (e)=>{
                    e.preventDefault();
            
                    Log.d(el.getAttribute("href"));
                    const target = typeof el.getAttribute("target");
                    if(typeof target ==='strings'){

                    }else{
                        // show progress
                        ProgressBar.show();

                        const whereis = el.getAttribute("href");
                        const doc_id = whereis.split('/')[1];
                        const doc_id_val = whereis.split('/')[1];
                        const filename = `./${whereis}.html`;
                        const tpl_id = `#tpl_${whereis.replace('/','_')}`;
            
                        // 출력
                        this.doEcho(filename, tpl_id);

                        // 경로 만들기
                        urlManager.pushState(doc_id,doc_id,`./?doc_id=${doc_id_val}`);
                    }
                },false);
            });

            this.doRouter ();
            this.doLazyload();
        }

        doLazyload () {
            // lazyload
            let myLazyLoad = new LazyLoad({
                container: document.querySelector("#left_docs_contents")
            });

            window.lazyFunctions = {
                section1: function (el) {
                    Log.d("section1");
                    Runnable(function(){
                        el.classList.toggle( "element-animation" );
                    });
                },
                section2: function (el) {
                    Log.d("section2");
                    Runnable(function(){
                        el.classList.toggle( "element-animation" );
                    });
                },
                section3: function (el) {
                    Log.d("section3");
                    Runnable(function(){
                        el.classList.toggle( "element-animation" );
                    });
                },
                section4: function (el) {
                    Log.d("section4");
                    Runnable(function(){
                        el.classList.toggle( "element-animation" );
                    });
                },
                section5: function (el) {
                    Log.d("section5");
                    Runnable(function(){
                        el.classList.toggle( "element-animation" );
                    });
                }
            };

            let callback_exit = function (el) {
                Log.d("EXITED");
                Runnable(function(){
                    el.classList.toggle( "element-animation" );
                });
            };
            let callback_loading = function (el) {
                Log.d("LOADING");
            };
            let callback_loaded = function (el) {
                Log.d("LOADED");
            };
            let callback_error = function (el) {
                Log.e("ERROR");
            };
            let callback_finish = function () {
                Log.d("FINISHED");
            };
            let callback_cancel = function (el) {
                Log.d("CANCEL");
            };
        
            function executeLazyScript(el) {
                Log.d("🔑 ENTERED", el);
                let lazyFunctionName = el.getAttribute("data-lazy-function");
                let lazyFunction = lazyFunctions[lazyFunctionName];
                if (!lazyFunction) return;
                lazyFunction(el);
            }
        
            let ll = new LazyLoad({
                unobserve_entered: false, // <- To avoid executing the script multiple times
                callback_enter: executeLazyScript, // Assigning the function defined above
                callback_exit: callback_exit,
                callback_cancel: callback_cancel,
                callback_loading: callback_loading,
                callback_loaded: callback_loaded,
                callback_error: callback_error,
                callback_finish: callback_finish
            });
        }

        doRouter (){
            // router
            const url_docid =((urlManager).searchParams).get('doc_id');
            Log.d('--> doc_id : check --->',url_docid, typeof url_docid);
            if(typeof url_docid ==='string'){
                const filename = `docs/${url_docid}.html`;
                const tpl_id = `#tpl_docs_${url_docid}`;

                this.doEcho(filename, tpl_id);
            }
        }

        doEcho(filename, tpl_id){
            // template
            new Template().readFile(filename, tpl_id).then((tpl)=>{
                document.querySelector('#left_docs_contents').innerHTML = new Template().render(tpl,{});
                return true;
            })
            .then(()=>{
                document.querySelectorAll('code').forEach((el)=>{
                    let code_css = el.getAttribute('class');
                    let code_lang = code_css.split('-')[1];
                    Log.d(code_css, code_lang);

                    let _ess = el.innerText;
                    _ess = String(_ess).replace(/&amp;gt;/g, '>');
                    const html = Prism.highlight(_ess, Prism.languages[code_lang], code_lang);
                    el.innerHTML = `${html}`;
                });

                // scroll top
                document.querySelector('#left_docs_contents').scrollTo({top: 0, behavior: 'smooth'});

                // close pregress
                Handler.post(()=>{
                    ProgressBar.close();
                },100);
            })
            .catch((message)=>{
                Log.e(message);
            })
            .finally(()=>{
                // close pregress
                Handler.post(()=>{
                    ProgressBar.close();
                },100);
            });
        }
    }

    const myActivity = new MyActivity();

    // css import test
    Handler.post(()=>{
        new AsyncTask().doImportCss('css/fontawesome-all.min.css').then(()=>{
            Log.d('completed');
        });
    },10);

    // close pregress
    ProgressBar.close();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);