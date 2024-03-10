export default class Forms {
    constructor(targetId) {
        this.__version = '2.0';
        this.targetId = targetId;
        this.formElem = document.querySelector(this.targetId); // Store the form element
    }

    // submit
    /**
     * 
     * @param {Form id="theForm"} targetId 
     * @param {function()} callback 
     */
    doSubmit(callback) {
        let send_params = null;
        this.formElem.addEventListener('submit', function(e) {
            e.preventDefault();
            send_params = {};

            // 데이터 필터링
            const formData = new FormData(this.formElem);
            formData.forEach((val, name) => {
                let nodeName = (this.formElem.elements[name].length > 1) ? this.formElem.elements[name][0].nodeName : this.formElem.elements[name].nodeName;
                let _value = (nodeName == 'TEXTAREA') ? encodeURIComponent(val) : val;
                send_params[name] = (typeof send_params[name] !== 'undefined' && send_params[name] != '') ? `${send_params[name]},${_value}` : _value;
            });

            if (typeof callback === 'function') {
                callback(send_params);
            }
        });

        return this;
    }

    // 전송
    submit() {
        this.formElem.submit();
    }
}