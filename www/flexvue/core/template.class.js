"use strict";
export default class Template
{
    // 파일 절대 경로 찾기
    chroot (filename, importmurl){
        return new URL(filename, importmurl).href;
    }

    // template 파일 찾기
    async readFile (filename, _options={}, _headers=null)
    {
        // if ('content' in document.createElement('template')) 
        // {

            let headers = _headers || {
                'Content-Type': 'text/plain'
            };

            let options = {
                // method: 'GET',
                // mode: '*', 
                cache: 'no-cache',
                headers: new Headers(headers)
            };

            Object.entries(_options).forEach(([key, value]) => {
                options[key] = value;
            });

            const response = await fetch(filename, options);
            if(response.ok){
                const _tpl = await response.text();
                // const _outTpl = new DOMParser().parseFromString(_tpl, 'text/html').querySelector(template_id).innerHTML;

                // append template
                // document.querySelector('body').insertAdjacentHTML('afterend', _tpl );
                return _tpl;
            }
            throw new Error(response.status);
        // }
    }

    /**
     * 
     * @param <template id="#tpl_test"> : template_id 
     * @returns 
     */
    async include (template_id){
        if(document.querySelector(template_id).content !==null){
            const fragment = document.querySelector(template_id).content;
            const tpl = document.importNode(fragment,true);
            return await new XMLSerializer().serializeToString(tpl);
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