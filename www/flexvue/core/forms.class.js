/**
 * forms
 */
class Forms {
    // submit
    /**
     * 
     * @param {Form id="theForm"} targetId 
     * @param {function()} callback 
     */
    doSubmit(targetId, callback) 
    {
        let send_params = null;
        const formElem = document.querySelector(targetId);
        formElem.addEventListener('submit', function(e) 
        {
            e.preventDefault();
            send_params = {};

            // 데이터 필터링
            const formData = new FormData(formElem);
            formData.forEach( (val, name) => {
                let nodeName = (formElem.elements[name].length > 1) ? formElem.elements[name][0].nodeName : formElem.elements[name].nodeName;
                let _value = (nodeName == 'TEXTAREA') ? encodeURIComponent(val) : val;
                send_params[name] = (typeof send_params[name] !== 'undefined' && send_params[name]!='') ? `${send_params[name]},${_value}` : _value;
            });
            Log.d (send_params);

            if(typeof callback === 'function'){
                callback(send_params);
            }
        });
    }
}

export {Forms};
