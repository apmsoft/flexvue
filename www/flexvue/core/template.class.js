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
                return new Promise((resolve, reject) => {
                    let _len = filename.length;
                    let _lastIdx = filename.lastIndexOf('.');
                    let _fileExtention = filename.substring(_lastIdx, _len).toLowerCase();

                    let mimetype = (_fileExtention == '.html') ? "text/html" : "text/plain";
                    var xobj = new XMLHttpRequest();
                    xobj.overrideMimeType(mimetype);
                    xobj.open('GET', filename, true); // Replace 'my_data' with the path to your file
                    xobj.onreadystatechange = function () {
                        if (xobj.readyState == 4 && xobj.status == "200") {
                            Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',xobj.responseText ))).then(function() 
                            {
                                // out rendering html
                                resolve (document.querySelector('script'+template_id).innerText);
                            });
                        }
                    };
                    xobj.send(null);
                });
            }else{
                let headers = _headers || {
                    'Content-Type': 'text/html'
                };

                let options = {
                    method: 'GET',
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