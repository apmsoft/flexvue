"use strict";
export default class AsyncTask 
{
    // get
    /**
     * @param {전송방식} method 
     * @param {서버 접속 경로} url 
     * @param {전송할 데이터} params 
     * @param {옵션} _options 
     * @param {전송할 헤더값} _headers 
     */
    async execute(method, url, params, _options={},_headers=null) 
    {
        // 접속경로
        let redirect_url = url;

        // headers
        let headers = _headers || {
            'Content-Type': 'application/json'
        };

        // params
        const _method = method.toUpperCase();

        // 옵션
        let options = {
            method: _method, // *GET, POST, PUT, DELETE, etc.
            // mode: 'no-cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer',
            // credentials: 'omit',
            headers: new Headers(headers)
        };

        if(_method != 'GET')
        {
            // let url_param = Object.entries(params).map(([key, val]) => `${key}=${val}`).join("&");
            Object.assign(options, {
                body: params
            });
        }

        Log.d(options);
        
        
        Object.assign(options, _options);
        // Log.d(options);

        const response = await fetch(redirect_url, options);
        const contentType = response.headers.get('content-type');
        if (!response.ok){
            Log.e(response);
            throw new Error(response.status);
        }

        // Log.d(contentType);
        let result;
        if(contentType.includes('application/json')){
            result = await response.json();
        }else if(contentType.includes('text')){
            result = await response.text();
        }else if(contentType.includes('application')){
            result = await response.blob();
        }

        return result;
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