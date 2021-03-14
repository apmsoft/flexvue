class AsyncTask 
{
    // get
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송한 json 데이터} params 
     * @param {성공|실패 후 콜백 함수} callback 
     */
    async doGet(url, params, callback) 
    {
        let self = this;
        let successCallback = ((callback !== null) && (typeof callback.success === 'function')) ? callback.success : null;
        let falseCallback = ((callback !== null) && (typeof callback.fail === 'function')) ? callback.fail : null;

        // 접속경로
        let redirect_url = url;
        let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
        redirect_url = `${redirect_url}?${url_param}`;
        Log.i(redirect_url);

        // 옵션
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: config.cache, // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const resp = await fetch(redirect_url, options);
            if (!resp.ok) {
                throw Error(resp.text());
            }
            if(resp.ok)
            {
                let responseCopy = resp.clone();
                try{
                    response = await resp.json();
                    callback(response);
                }catch( e ){
                    Log.e(responseCopy.text());
                }
            }
        }catch (e){
            Log.e(e);
        }
    }

    // post | input
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송한 json 데이터} params 
     * @param {성공|실패 후 콜백 함수} callback 
     */
    async doPostMessage(url, params, callback) 
    {
        let successCallback = ((callback !== null) && (typeof callback.success === 'function')) ? callback.success : null;
        let falseCallback = ((callback !== null) && (typeof callback.fail === 'function')) ? callback.fail : null;

        // 자동 프로그램 확장자 설정
        let redirect_url = url;

        // option
        let options = {
            method: ((typeof params.id !== 'undefined') && (params.id !== null)) ? 'PUT':'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };

        // return data
        let response = {};

        Log.i(redirect_url);

        try {
            const resp = await fetch(redirect_url, options);
            if (!resp.ok) {
                throw Error(resp.statusText);
            }

            if(resp.ok){
                let responseCopy = resp.clone();
                try{
                    response = await resp.json();
                    if (response.result == 'true') {
                        if (successCallback !== null) {
                            successCallback(response);
                        }
                    } else if (response.result == 'false') {
                        if (falseCallback !== null) {
                            falseCallback(response);
                        }
                    }
                }catch(e){
                    Log.e(responseCopy.text());
                }
            }
        }catch (e){
            Log.e (e);
        }
    }
}

export {AsyncTask};