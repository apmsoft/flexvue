import Template from '../../flexvue/core/template.class.js';

const onReady = () => 
{
    // 템플릿 파일명과 템플릿 id
    const template_filename = `tpl/test.tpl.js`;
    const template_id = '#tpl_test';

    // 템플릿 파일 가지고 오기
    new Template().readFile( template_filename, template_id).then( tpl =>{
        // render 
        const outhtml_el = document.querySelector('#echo_contents');
        outhtml_el.innerHTML = new Template().render( tpl, {
            name : "홍길동",
            age : 27
        } );
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);