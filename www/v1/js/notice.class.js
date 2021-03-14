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
        Log.d(urlManager.removeUrlParams('doc_id'));

        // template print
        new Template(`${config.asset}/tpl/test2.html`, '#tpl_test2').print({ name : '유관순', age : 30 }, function (tpl)
        {
            Promise.resolve((document.querySelector('#notice_list').innerHTML = tpl )).then(function() 
            {
                // close progress
                ProgressBar.close();
            });
        });
    }
}

export {Notice};