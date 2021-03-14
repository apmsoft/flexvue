class Activity {
    constructor(){
        Log.d('activity');
    }

    onBackPressed (callback) 
    {
        // 뒤로가기
        window.onpopstate = function(event) {
            var pre_state = '';
            var is_Trustred = false;
            if (typeof event.isTrusted !=='undefined' && event.isTrusted) {
                is_Trustred = true;
            } else if (typeof event.state !=='undefined' && event.state != 'null') {
                is_Trustred = true;
            }

            if (is_Trustred) 
            {
                // 이전경로 do 체크
                if(window.history.state !== null && window.history.state){
                    pre_state = window.history.state;
                }else if (typeof UrlUtil._url_params.do !== 'undefined' && UrlUtil._url_params.do !=''){
                    pre_state = UrlUtil._url_params.do;
                }

                if (document.querySelector('#bottomthird').classList.contains('bottomthird_transitioned')) {
                    document.querySelector('#bottomthird_docs_contents').innerHTML ='';
                    document.querySelector("#bottomthird").classList.toggle('bottomthird_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#bottomside').classList.contains('bottomside_transitioned')) {
                    document.querySelector('#bottomside_docs_contents').innerHTML ='';
                    document.querySelector("#bottomside").classList.toggle('bottomside_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#bottom').classList.contains('bottom_transitioned')) {
                    document.querySelector('#bottom_docs_contents').innerHTML ='';
                    document.querySelector("#bottom").classList.toggle('bottom_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#rightthird').classList.contains('rightthird_transitioned')) {
                    document.querySelector('#rightthird_docs_contents').innerHTML ='';
                    document.querySelector("#rightthird").classList.toggle('rightthird_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#rightside').classList.contains('rightside_transitioned')) {
                    document.querySelector('#rightside_docs_contents').innerHTML ='';
                    document.querySelector("#rightside").classList.toggle('rightside_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#right').classList.contains('right_transitioned')) {
                    document.querySelector('#right_docs_contents').innerHTML ='';
                    document.querySelector("#right").classList.toggle('right_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                }else if (document.querySelector('#drawer_menu').classList.contains('drawer_menu_transitioned')) {
                    document.querySelector("#drawer_menu").classList.toggle('drawer_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else { 
                  
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }else{
                        history.go(-1);
                    }
                }
            }
        };
    }

    async include (filename) {
        try {
            const resp = await fetch(self.filename, {mode: 'cors', cache: 'default'});
            if(resp.ok){
                await resp.javascript()
            }
        }catch (e){
            Log.e(e);
        }
    }
}

export  {Activity};