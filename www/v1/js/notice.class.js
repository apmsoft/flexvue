import {UrlManager} from '../../flexvue/core/urlmanager.class.js';
import {Template} from '../../flexvue/core/template.class.js';
import {Forms} from '../../flexvue/core/forms.class.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.js';

class Notice {
    constructor(){
    }

    doList(params)
    {
        // show progress
        ProgressBar.show();

        // self
        const self = this;

        // url
        const urlManager = new UrlManager(document.location);
        urlManager.mergeURLParams(params);
        Log.d('>>>>>', 'Notice :: doList', urlManager.url_params);
        Log.d(urlManager.getUrlParams('page','doc_id'));
        // Log.d(urlManager.removeUrlParams('doc_id'));

        // multiout
        Promise.all([
            new AsyncTask().doGet('../res/values/sysmsg.json', {}), 
            new Template().readFile(`${config.asset}/tpl/test2.html`, '#tpl_test2')
        ]).then((data) => {
            const tpl = data[1];
            const resp = data[0];

            new Promise((resolve)=>{
                document.querySelector('#notice_list').innerHTML = new Template().render(tpl,resp);
                resolve(true);
            }); 
        }).then(()=>{
            document.querySelector('p').addEventListener('click',(el)=>{
                alert(el.innerText);
            });
        }).finally(()=>{ ProgressBar.close(); } );
    }
}

export {Notice};