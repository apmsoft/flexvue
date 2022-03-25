import Template from '../../flexvue/core/template.class.js';
import {_template, _testtpl} from '../tpl/template.js';


const onReady = () => 
{
    Log.d(_testtpl);
    // const htmlUrl = new URL('../tpl/test.html', import.meta.url).href;
    // fetch(htmlUrl).then(response => alert(response.text()));
    

    // 1. 템플릿 파일 가지고 오기
    const template_filename = new Template().chroot(`../tpl/test.html`,import.meta.url);
    new Template().readFile( template_filename)
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

    
    // 2. import js 스트림 템플릿 사용
    const outhtml_el2 = document.querySelector('#echo_contents2');
    outhtml_el2.innerHTML = new Template().render( _testtpl, {
        name : "홍길동",
        age : 27, 
        msg : [
            {name : '홍길동'},
            {name : '유관순'}
        ]
    } );
    

    
    // 3. import js 함수 템플릿 사용
    const outhtml_el = document.querySelector('#echo_include_template');
    outhtml_el.innerHTML = _template({
        name : "인클루드 템플릿",
        age : 27,
        msg : [
            {name : '홍길동'},
            {name : '유관순'}
        ]
    });

    
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);