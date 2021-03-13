
// Tagged template function

const DocAsyncTask = {
    version: '1.2.4',

    
    // get
    doGetContents(feature, params, callback) 
    {
        let self = this;
        let successCallback = ((callback !== null) && (typeof callback.success === 'function')) ? callback.success : null;
        let falseCallback = ((callback !== null) && (typeof callback.fail === 'function')) ? callback.fail : null;

        let frame         = feature.frame;
        let template_html = feature.template;

        // frame output html
        self.doPrintFrameHtml(frame, function()
        {
            // get data
            self.doFetchData(feature, params, function(response)
            {
                if (response.result == 'true') {
                    // 템플릿 출력전 html 먼저 출력하기
                    self.doTemplateRender(template_html,response,function(tpl){
                        if (successCallback !== null) {
                            successCallback(tpl,response);
                        }
                    });
                } else if (response.result == 'false') {
                    if (falseCallback !== null) {
                        falseCallback(response);
                    }
                }
            });
        });
    },

    // frame html 출력
    doPrintFrameHtml(frame, callback){
        // html 
        if (frame !== null){
            if (frame.indexOf("#") > -1)
            {
                let arr       = frame.split('#');
                let frame_src = arr[0];
                let frame_id  = arr[1];
                
                require(['text!' + frame_src + '.html'], function(frame_html) {
                    Promise.resolve((document.querySelector('#'+frame_id).innerHTML = frame_html)).then(function() 
                    {
                        callback();
                    });
                });
            }else{
                callback();
            }
        }else{
            callback();
        }
    },

    // data fetch
    async doFetchData(feature, params, callback){
        let self = this;

        let response = {};

        // back-end 경로가 null 인지 체크 후 행동
        if (feature.value === null) {
            response = {result: 'true',msg: ''};
            callback(response);
        }
        // json Object 데이터 인지 확인
        else if (typeof feature.value === 'object') {
            response = Object.assign({result: 'true',msg:''}, feature.value);
            callback(response);
        } else {
            // 자동 프로그램 확장자 설정
            let redirect_url = feature.value;
            if((app.server_language !==null) && app.server_language !=''){
                redirect_url = `${redirect_url}${app.server_language}`;
            }

            // 경로 자동설정
            if(app.src !==null && app.src !=""){
                redirect_url = `${app.src}/${redirect_url}`;
            }

            let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
            redirect_url = `${redirect_url}?${url_param}`;

            // 옵션
            let options = {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            app.log(redirect_url);

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
                        console.log('error:', responseCopy.text());
                    }
                }
            }catch (e){
                app.log (e);
            }
        }
    },

    // make template render
    doTemplateRender(template_html, response, callback){
        let template_id   = '';

        if(template_html !== null)
        {
            // template 아이디 찾기
            if (template_html.indexOf("#") > -1) {
                let arr = template_html.split('#');
                template_html = arr[0];
                template_id = arr[1];
            }

            // 템플릿이 HTML 에서 포함된 상태
            if (template_html == 'included') {
                let tpl = document.querySelector('script#'+template_id).innerText;
                callback(template(tpl, response));
            } else {
                let count = app.template.length;
                let is_resource = false;
                for (let i = 0; i < count; i++) {
                    if (app.template[i] != null && app.template[i] == template_html) {
                        is_resource = true;
                        break;
                    }
                }

                if (!is_resource) {
                    require(['text!' + template_html + '.html'], function(text_template) {
                        app.template[count] = template_html;
                        Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',text_template))).then(function() 
                        {
                            let tpl = document.querySelector('script#'+template_id).innerText;
                            callback(template(tpl, response));
                        });
                    });
                }else{
                    let tpl = document.querySelector('script#'+template_id).innerText;
                    callback(template(tpl, response));
                }
            }
        }else{
            callback(null);
        }
    },

    // post input
    async doPostMessage(url, params, callback) {
        let successCallback = ((callback !== null) && (typeof callback.success === 'function')) ? callback.success : null;
        let falseCallback = ((callback !== null) && (typeof callback.fail === 'function')) ? callback.fail : null;

        // 자동 프로그램 확장자 설정
        let redirect_url = url;
        if((app.server_language !==null) && app.server_language !=''){
            redirect_url = `${redirect_url}${app.server_language}`;
        }

        // 경로 자동설정
        if(app.src !==null && app.src !=""){
            redirect_url = `${app.src}/${redirect_url}`;
        }

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
        let response = {};

        app.log(redirect_url);

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
                    console.log('error:', responseCopy.text());
                }
            }
        }catch (e){
            app.log (e);
        }
    },

    // submit
    doSubmit(targetId, callback) {
        let send_params = null;
        const formElem = document.querySelector(targetId);
        formElem.addEventListener('submit', function(e) 
        {
            e.preventDefault();
            send_params = {};

            // 데이터 필터링
            const formData = new FormData(formElem);
            formData.forEach( (val, name) => {
                let nodeName = (formElem.elements[name].length > 1) ? formElem.elements[name][0].nodeName : formElem.elements[name].nodeName;
                let _value = (nodeName == 'TEXTAREA') ? encodeURIComponent(val) : val;
                send_params[name] = (typeof send_params[name] !== 'undefined' && send_params[name]!='') ? `${send_params[name]},${_value}` : _value;
            });
            app.log('//--submit--->');
            app.log (send_params);
            app.log('<---------//');

            if(typeof callback === 'function'){
                callback(send_params);
            }
        });
    }
};
