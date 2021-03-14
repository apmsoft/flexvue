/**
 * 템플릿
 */
class Template {
    
    constructor(filename, template_id){
        this.filename = filename;
        this.template_id = template_id;
    }

    // template 파일 찾기
    async print (data, callback)
    {
        const self = this;
        let type = document.querySelector('script'+self.template_id);
        try {
            if(type && type !== 'null')
            {
                Log.d('is disk cache');
                // out rendering html
                const _tpl = document.querySelector('script'+self.template_id).innerText;
                const _render = self.render(_tpl, data);
                callback(_render);
            }else{
                Log.d('read file');
                const resp = await fetch(self.filename, {mode: 'cors', cache: 'default'});
                if(resp.ok){
                    Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',await resp.text() ))).then(function() 
                    {
                        // out rendering html
                        const _tpl = document.querySelector('script'+self.template_id).innerText;
                        const _render = self.render(_tpl, data);
                        callback(_render);
                    });
                }

            }
        }catch (e){
            Log.e(e);
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