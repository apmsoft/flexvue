"use strict";
export default class AsyncTask 
{
    // get
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송할 json 데이터} params 
     */
    async doGet(url, params) 
    {
        let self = this;

        // 접속경로
        let redirect_url = url;
        if(Object.keys(params).length > 0){
            let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
            redirect_url = `${redirect_url}?${url_param}`;
        }
        Log.d('doGet --> '+redirect_url);

        // 옵션
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: config.cache, // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const response = await fetch(redirect_url, options);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    // post | input
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송할 json 데이터} params 
     */
    async doPost(url, params) 
    {
        // 자동 프로그램 확장자 설정
        let redirect_url = url;

        // option
        let options = {
            method: ((typeof params.id !== 'undefined') && (params.id !== null)) ? 'PUT':'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(params)
        };

        Log.d(redirect_url);

        const response = await fetch(redirect_url, options);
        if (response.ok) return await response.json();
        throw new Error(response.status);
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