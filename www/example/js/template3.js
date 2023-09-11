import Template from '../tpl/template3.js';

const onReady = () =>
{
    const data = {
        name : "인클루드 템플릿",
        age : 27,
        msg : [
            {name : '홍길동'},
            {name : '유관순'}
        ]
    };

    // 일반형
    const outhtml_el = document.querySelector('#echo_contents2');
    outhtml_el.innerHTML = Template(data );
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);