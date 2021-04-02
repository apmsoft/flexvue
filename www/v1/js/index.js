import {Template} from '../../flexvue/core/template.class.min.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.min.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.min.js';

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