

const onReady = () => 
{
    // default values
    const form_values = {
        price : 1000,
        ea : 1,
        total : 0,
        options : ''
    };

    // 이벤트 발생
    const form    = document.querySelector('form');
    const options = document.querySelector('#options');
    const price   = document.querySelector('#price');
    const ea      = document.querySelector('#ea');
    const total   = document.querySelector('#total');

    // 폼전체에 사용할 이벤트
    form.addEventListener('update',function ( e ) {
        console.log(`${e.detail.name()} : ${e.detail.text()}`);
        
        // 키체크
        if(Object.keys(form_values).find(key => key === e.detail.name()))
        {
            // 해당키에 값 저장
            form_values[e.detail.name()] = e.detail.text();

            // sum total
            form_values.total = form_values.price * form_values.ea;
            console.log(form_values);

            // ouput total price
            total.value = form_values.total;
        }
    });

    // input,change
    options.addEventListener('change', function() {
        this.dispatchEvent(new CustomEvent('update', { bubbles: true, detail: { 
            text: () => options.value ,
            name: () => 'options'
        } }))
    });
    price.addEventListener('change', function() {
        this.dispatchEvent(new CustomEvent('update', { bubbles: true, detail: { 
            text: () => price.value ,
            name: () => 'price' 
        } }))
    });
    ea.addEventListener('change', function() {
        this.dispatchEvent(new CustomEvent('update', { bubbles: true, detail: { 
            text: () => ea.value ,
            name: () => 'ea' 
        } }))
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);