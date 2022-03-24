import Template from '../../flexvue/core/template.class.js';



const onReady = () => 
{
    // const htmlUrl = new URL('../tpl/test.html', import.meta.url).href;
    // fetch(htmlUrl).then(response => alert(response.text()));

    // 템플릿 파일명과 템플릿 id
    const template_filename = new Template().chroot(`../tpl/test.html`,import.meta.url);
    const template_id = '#tpl_test';

    // 템플릿 파일 가지고 오기
    new Template().readFile( template_filename, template_id)
    .then( tpl =>{
        // render 
        const outhtml_el = document.querySelector('#echo_contents');
        outhtml_el.innerHTML = new Template().render( tpl, {
            name : "홍길동",
            age : 27
        } );
    }).catch(e => {
        Log.e(e);
    });

    new Template().readFile( template_filename, template_id).then( tpl =>{
        // render 
        const outhtml_el2 = document.querySelector('#echo_contents2');
        outhtml_el2.innerHTML = new Template().render( tpl, {
            name : "홍길동",
            age : 27
        } );
    });

    
    // include template
    new Template().include('#tpl_include_test').
    then(tpl => {
        const outhtml_el = document.querySelector('#echo_include_template');
        outhtml_el.innerHTML = new Template().render( tpl, {
            name : "인클루드 템플릿",
            age : 27,
            msg : [
                {name : '홍길동'},
                {name : '유관순'}
            ]
        } );
    })
    .catch((e)=>{
        Log.e(e);
    });
    
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);