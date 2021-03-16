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

    // url -> json
    // void
    convertURL2JSON() {
        let result = {};
        let sPageURL = super.search;
        if(sPageURL.indexOf('?')>-1) {
            sPageURL = sPageURL.replace('?','');
        }
        if(sPageURL.indexOf('&')>-1) {
            let sURLVariables = sPageURL.split('&');
            sURLVariables.forEach(val => {
                let sParameterName = val.split('=');
                Log.i(sParameterName);
                var k = sParameterName[0];
                let v = sParameterName[1];
                result[k] = v;
            });
        }
    return result;
    }

    // location url 만들기
    // return string
    makeJSON2URL(params){
        this.mergeURLParams(params);
        let url_param = Object.entries(this.url_params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
        return url_param;
    }

    // params merge
    // void
    mergeURLParams(params){
        this.url_params = Object.assign({},this.url_params,params);
    }

    // history change url
    pushState(id, title, url){
        Activity.pre_state = id;
        window.history.pushState(id, title, url);
    }

    replaceStage(id, title, url){
         window.history.replaceState(id, title, url);
    }
}

export {UrlManager};