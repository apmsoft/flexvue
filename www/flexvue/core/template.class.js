"use strict";
export default class Template
{
    // 파일 절대 경로 찾기
    chroot (filename, importmurl){
        return new URL(filename, importmurl).href;
    }

    // template 파일 찾기
    async readFile (filename, template_id, _headers=null)
    {
        if ('content' in document.createElement('template')) 
        {

            let headers = _headers || {
                'Content-Type': 'text/plain'
            };

            Log.d(headers);

            let options = {
                // method: 'GET',
                // mode: '*', 
                cache: 'no-cache',
                headers: headers
            };

            const response = await fetch(filename, options);
            if(response.ok){
                const _tpl = await response.text();
                // const _outTpl = new DOMParser().parseFromString(_tpl, 'text/html').querySelector(template_id).innerHTML;

                // append template
                // document.querySelector('body').insertAdjacentHTML('afterend', _tpl );
                return _tpl;
            }
            throw new Error(response.status);
        }
    }

    /**
     * 
     * @param <template id="#tpl_test"> : template_id 
     * @returns 
     */
    async include (template_id){
        if(document.querySelector(template_id).content !==null){
            const fragment = document.querySelector(template_id).content;
            const tpl = await new XMLSerializer().serializeToString(document.importNode(fragment,true));
            Log.d(tpl);
            return tpl;
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