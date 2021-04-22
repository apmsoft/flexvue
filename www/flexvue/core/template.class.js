"use strict";
export default class Template {

    // template 파일 찾기
    async readFile (filename, template_id, _headers={})
    {
        const self = this;
        let type = document.querySelector('script'+template_id);
        if(type && type !== 'null')
        {
            Log.d('is disk cache');
            // out rendering html
            return document.querySelector('script'+template_id).innerText;
        }else{
            Log.d('read file');

            if(config.is_hybrideapp && (App.os == 'Android' || App.os == 'iPhone'))
            {
                if(typeof jQuery == "undefined"){
                    throw new Error('You need load jQuery Plugins, add plugin : import {} from ../flexvue/plugins/jquery/jquery.js');
                }

                return new Promise((resolve, reject) => {
                    $.get(filename,function(html) {
                        Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',html ))).then(function() 
                        {
                            // out rendering html
                            resolve (document.querySelector('script'+template_id).innerText);
                        });
                    });
                });
            }else{
                let headers = _headers || {
                    'Content-Type': 'text/html'
                };

                let options = {
                    mode: 'cors', 
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