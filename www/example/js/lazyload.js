/** lazyload */
import LazyLoad from '../../flexvue/plugins/lazyload/lazyload.esm.min.js';

const onReady = () => 
{
    // lazyload
    var myLazyLoad = new LazyLoad({
        container: document.querySelector("#left")
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);