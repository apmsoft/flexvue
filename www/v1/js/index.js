import {Template} from '../../flexvue/core/template.class.min.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.min.js';
import {UrlManager} from '../../flexvue/core/urlmanager.class.min.js';

// import {} from '../../flexvue/prism/prism.min.js';

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

    const js = ((code, lang) => {
        lang = lang || 'markup'
        return Prism.highlight(code, Prism.languages[lang], lang)
    })

    const css = ((code, lang) => {
        Log.i('code', code);
        Log.i('lnag', lang);
        lang = lang || 'markup'
        return Prism.highlight(code, Prism.languages[lang], lang)
    })

    // nav click event
    document.querySelectorAll('a').forEach((el)=>{
        el.addEventListener('click', (e)=>{
            e.preventDefault();
    
            Log.d(el.getAttribute("href"));
            const whereis = el.getAttribute("href");
            const filename = `${whereis}.html`;
            const tpl_id = `#tpl_${whereis.replace('/','_')}`;

            // 
            new Template().readFile(filename, tpl_id).then((tpl)=>{
                highlight: (code, lang) => {
        lang = lang || 'markup'
        return Prism.highlight(code, Prism.languages[lang], lang)
      }
                new Promise((resolve)=>{
                    document.querySelector('#left_docs_contents').innerHTML = new Template().render(tpl,{});
                    resolve(true);
                });
            })
            .then(()=>{
                // scroll top
                document.querySelector('#left_docs_contents').scrollTo({top: 0, behavior: 'smooth'});
            });
        },false);
    });

    // close pregress
    ProgressBar.close();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);