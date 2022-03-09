"use strict";
export default class Template {

    // template 파일 찾기
    async readFile (filename, template_id, _headers={})
    {
        let type = document.querySelector('script'+template_id);
        if(type && type !== 'null')
        {
            Log.d('is disk cache');
            // out rendering html
            return document.querySelector('script'+template_id).innerText;
        }else{
            if (/^file:\/\/\//.test(location.href)) {
                return new Promise((resolve, reject) => {
                    this.importPluginjQeury(function(){
                        $.get(filename,function(html) {
                            Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',html ))).then(function() 
                            {
                                // out rendering html
                                resolve (document.querySelector('script'+template_id).innerText);
                            });
                        });
                    });
                });
            }else{
                let headers = _headers || {
                    'Content-Type': 'text/html'
                };

                let options = {
                    // method: 'GET',
                    // mode: '*', 
                    cache: 'default',
                    headers: headers
                };

                const response = await fetch(filename, options);
                if(response.ok){
                    return Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',await response.text() ))).then(function() 
                    {
                        // out rendering html
                        return document.querySelector('script'+template_id).innerText;
                    });
                }
                throw new Error(response.status);
            }
        }
    }

    importPluginjQeury (callback) {
        if(document.querySelector(`[src="flexvue/plugins/jquery/ajax.min.js"]`) ===null){
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = 'flexvue/plugins/jquery/ajax.min.js';
            head.appendChild(script);
            script.onload = function () {
                callback();
            };
        }else{
            callback();
        }
    }

    /**
     * 
     * @param {json data} data 
     * @returns : rendering html
     */
    render (tpl,data){
        const func = new Function(...Object.keys(data),  "return `"+tpl+"`;");
        return func(...Object.values(data));
    }
}