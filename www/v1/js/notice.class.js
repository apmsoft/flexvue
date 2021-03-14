import {UrlManager} from '../../flexvue/core/urlmanager.class.js';

class Notice {
    constructor(){
    }

    doList(params){
        const self = this;

        // url
        const urlManager = new UrlManager(document.location);
        urlManager.mergeURLParams(params);
        Log.d('>>>>>', 'Notice :: doList', urlManager.url_params);
        Log.d(urlManager.getUrlParams('page','doc_id'));
        Log.d(urlManager.removeUrlParams('doc_id'));
    }
}

export {Notice};