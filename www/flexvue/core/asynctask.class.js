class AsyncTask 
{
    // get
    /**
     * 
     * @param {서버 접속 경로} url 
     * @param {전송한 json 데이터} params 
     */
    async doGet(url, params) 
    {
        let self = this;

        // 접속경로
        let redirect_url = url;
        if(params.length > 0){
            let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
            redirect_url = `${redirect_url}?${url_param}`;
        }
        Log.i('doGet --> '+redirect_url);

        // 옵션
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            cache: config.cache, // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
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
     * @param {전송한 json 데이터} params 
     */
    async doPostMessage(url, params) 
    {
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

        Log.i(redirect_url);

        const response = await fetch(redirect_url, options);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }
}

export {AsyncTask};