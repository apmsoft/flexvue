"use strict";
class UrlManager extends URL {
    constructor(url) {
        super(url);
        this.version = 1;
        this.current_id = '';
        this.url_params = this.convertURL2JSON() || {};
    }

    doEmpty (){
        this.url_params = {};
    }

    // Log.d(urlManager.removeParams('page','doc_id'));
    // return {}
    removeUrlParams (...argv){
        const self = this;
        let result = self.url_params;
        if(Array.isArray(argv)){
            argv.forEach(function(k){
                if(result.hasOwnProperty(k)){
                    delete result[k];
                }
            });
        }
    return result || {};
    }

    // Log.d(urlManager.getUrlParams('page','doc_id'));
    // return {}
    getUrlParams (...argv){
        const self = this;
        let result = {};
        if(Array.isArray(argv)){
            argv.forEach(k => {
                if(self.url_params.hasOwnProperty(k)){
                    result[k] = self.url_params[k];
                }
            });
        }
    return result;
    }

    // url (page=1&category=a) -> json {page :1, category:a}
    convertURL2JSON() {
        this.doEmpty ();
        this.url_params = Object.fromEntries( new URLSearchParams(super.search) );
    }

    // location url 만들기
    // json {page :1, category:a} -> page=1&category=a
    makeJSON2URL(params){
        this.mergeURLParams(params);
        let url_param = Object.entries(this.url_params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
        return url_param;
    }

    // params merge
    mergeURLParams(params){
        this.url_params = Object.assign(this.url_params, params);
    }

    // history change url
    pushState(id, title, url){
        // 윈도우 화면 위치 공유
        if(Activity.push_state !='' && Activity.push_state !==null){
            let cur_state = Activity.push_state;
            Activity.history_state[cur_state] = id;
        }

        window.history.pushState(id, title, url);
    }

    hashLocation (hash){
        location.hash = hash;
    }
}

export {UrlManager};