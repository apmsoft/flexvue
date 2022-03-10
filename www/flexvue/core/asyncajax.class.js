"use strict";
export default class AsyncAjax
{
    // get
    /**
     * @param {전송방식} method 
     * @param {서버 접속 경로} url 
     * @param {전송할 데이터} params 
     * @param {옵션} _options 
     * @param {전송할 헤더값} _headers 
     */
    async execute(method, url, params={}, _options={},_headers=null) 
    {
        return new Promise((resolve, reject) => {
            // method
            const _method = method.toUpperCase();

            // headers
            let headers = _headers || {
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
            };

            // options
            let options = {
                method: _method,
                url: url,
                data: params,
                cache:false,
                crossOrigin: true,
                dataType : "json"
            };

            Object.assign(options, _options, headers);
            Log.d(options);

            $.ajax(options)
            .done(function( data ) {
                resolve (data);
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                throw new Error(err);
            });
        });
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