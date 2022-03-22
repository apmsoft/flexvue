"use strict";
export default class Template{

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
                cache: 'force-cache',
                headers: headers
            };

            const response = await fetch(filename, options);
            if(response.ok){
                const _tpl = await response.text();
                const _outTpl = new DOMParser().parseFromString(_tpl, 'text/html').querySelector('#tpl_test').innerHTML;

                // append template
                // document.querySelector('body').insertAdjacentHTML('afterend', _tpl );
                return _outTpl;
            }
            throw new Error(response.status);
        }
    }

    /**
     * 
     * @param <template id="#tpl_test"> : template_id 
     * @returns 
     */
    async importNodeTemplate (template_id){
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