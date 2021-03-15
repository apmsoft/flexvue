/**
 * 템플릿
 */
class Template {

    // template 파일 찾기
    async readFile (filename, template_id)
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
            const response = await fetch(filename, {mode: 'cors', cache: 'default'});
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

export {Template};