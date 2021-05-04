"use strict";
export default class AsyncTask 
{
    // get
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송할 json 데이터} params 
     * @param {전송할 헤더값} _headers 
     */
    async doGet(url, params, _headers={}) 
    {
        let self = this;
        
        let _len = url.length;
        let _lastIdx = url.lastIndexOf('.');
        let _fileExtention = url.substring(_lastIdx, _len).toLowerCase();
        if (_fileExtention == '.json' && /^file:\/\/\//.test(location.href)) {
            return new Promise((resolve, reject) => {
                this.importPluginjQeury(function(){
                    $.getJSON( url, {format: "json"})
                    .done(function( data ) {
                        resolve (data);
                    })
                    .fail(function( jqxhr, textStatus, error ) {
                        var err = textStatus + ", " + error;
                        throw new Error(err);
                    });
                });
            });
        }else{
            // 접속경로
            let redirect_url = url;
            if(Object.keys(params).length > 0){
                let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
                redirect_url = `${redirect_url}?${url_param}`;
            }
            Log.d('doGet --> '+redirect_url);

            let headers = _headers || {
                'Content-Type': 'application/json'
            };

            // 옵션
            let options = {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: config.cache, // *default, no-cache, reload, force-cache, only-if-cached
                headers: headers
            };

            const response = await fetch(redirect_url, options);
            if (response.ok) return await response.json();
            throw new Error(response.status);
        }
    }

    // post | input
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송할 json 데이터} params
     * @param {전송할 헤더값} _headers  
     */
    async doPost(url, params, _headers={}) 
    {
        // 자동 프로그램 확장자 설정
        let redirect_url = url;

        let headers = _headers || {
            'Content-Type': 'application/json'
        };

        // option
        let options = {
            method: ((typeof params.id !== 'undefined') && (params.id !== null)) ? 'PUT':'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: headers,
            body: JSON.stringify(params)
        };

        Log.d(redirect_url);

        const response = await fetch(redirect_url, options);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    importPluginjQeury (callback) {
        if(document.querySelector(`[src="flexvue/plugins/jquery/jquery.js"]`) ===null){
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = 'flexvue/plugins/jquery/jquery.js';
            head.appendChild(script);
            script.onload = function () {
                callback();
            };
        }else{
            callback();
        }
    }

    async doImport(url) {
        Log.d('doImport : '+url);
        return await import(url).then(Module => {
            return Module;
        });
    }

    async doImportCss(url){
        Log.d('doImportCss : '+url);
        if(document.querySelector(`[href="${url}"]`) ===null){
            Log.d("run link import css");
            return await document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="${url}" />`);
        }
    }
}