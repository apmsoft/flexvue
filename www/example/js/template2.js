import Template from '../tpl/template.js';

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

    // 비동기
    new Template().render( data )
    .then(tpl =>{
        const outhtml_el = document.querySelector('#echo_contents1');
        outhtml_el.innerHTML = tpl;
    });

    // 일반형
    const outhtml_el = document.querySelector('#echo_contents2');
    outhtml_el.innerHTML = new Template().render2( data );
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);