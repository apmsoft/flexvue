import Template from '../../flexvue/core/template.class.min.js';

const onReady = () =>
{
    // Log.d(_testtpl);
    // const htmlUrl = new URL('../tpl/test.html', import.meta.url).href;
    // fetch(htmlUrl).then(response => alert(response.text()));

    const template_filename = new Template().chroot(`../tpl/test.html`,import.meta.url);
    document.body.append(template_filename);

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
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);