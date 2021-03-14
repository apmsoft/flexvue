/**
 * 템플릿
 */
class Template {

    constructor(filename, template_id){
        this.filename = filename;
        this.template_id = template_id;
        this.template = {};
    }

    // template 파일 찾기
    async print (outElementId, data, callback)
    {
        const self = this;

        // templat disk cache id
        const tpl_key = self.template_id.replace('#','');

        // is disk cache
        if(typeof self.template[tpl_key] !=='undefined')
        {
            // out rendering html
            const _tpl = document.querySelector('script'+self.template_id).innerText;
            Promise.resolve( (document.querySelector(outElementId).innerHTML = self.render(_tpl, data)) ).then(function() {
                callback();
            });
        }
        else{
            try {
                const resp = await fetch(this.filename, {mode: 'cors', cache: 'default'});
                if(resp.ok){
                    Promise.resolve((document.querySelector('body').insertAdjacentHTML('afterend',await resp.text() ))).then(function() 
                    {
                        // push template 
                        self.template[tpl_key] = true;
                        
                        // out rendering html
                        const _tpl = document.querySelector('script'+self.template_id).innerText;
                        Promise.resolve( (document.querySelector(outElementId).innerHTML = self.render(_tpl, data)) ).then(function(){
                            callback();
                        });
                    });
                }
            }catch (e){
                Log.e(e);
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

export {Template};